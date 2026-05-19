import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { inputText, feedback, photoUrls } = await req.json();

  const memorial = await prisma.memorialPage.findUnique({ where: { id } });
  if (!memorial) {
    return NextResponse.json({ error: "Stránka nenalezena" }, { status: 404 });
  }

  if (inputText !== undefined) {
    await prisma.memorialPage.update({
      where: { id },
      data: { inputText },
    });
  }

  const birthStr = format(memorial.birthDate, "d. MMMM yyyy", { locale: cs });
  const deathStr = format(memorial.deathDate, "d. MMMM yyyy", { locale: cs });
  const photosHtml =
    photoUrls && photoUrls.length > 0
      ? photoUrls
          .map(
            (url: string, i: number) =>
              `<img src="${url}" alt="Vzpomínka ${i + 1}" class="memorial-photo" />`
          )
          .join("\n")
      : "";

  const systemPrompt = `Jsi asistent pro tvorbu pietních pamětních stránek v češtině.
Tvým úkolem je vytvořit krásnou, důstojnou HTML stránku jako vzpomínku na zesnulého.
Stránka musí být kompletní HTML dokument s vloženým CSS (žádné externí závislosti).
Použij teplé, uklidňující barvy – krémová, světle hnědá, zlatavá.
Stránka musí být responzivní a elegantní. Napiš ji s laskavostí a pietou.`;

  const userPrompt = `Vytvoř pamětní stránku pro: ${memorial.deceasedName}
Datum narození: ${birthStr}
Datum úmrtí: ${deathStr}

${inputText ? `Informace o osobě:\n${inputText}` : ""}
${feedback ? `Připomínky k předchozí verzi:\n${feedback}` : ""}
${photosHtml ? `\nFotografie (vlož na vhodná místa):\n${photosHtml}` : ""}

Vygeneruj kompletní HTML stránku. Začni přímo <!DOCTYPE html>, bez jakéhokoliv komentáře před tím.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const generatedHtml =
    message.content[0].type === "text" ? message.content[0].text : "";

  await prisma.memorialPage.update({
    where: { id },
    data: { generatedHtml, ...(inputText !== undefined ? { inputText } : {}) },
  });

  return NextResponse.json({ html: generatedHtml });
}
