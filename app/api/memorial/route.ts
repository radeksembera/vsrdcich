import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";

export async function POST(req: NextRequest) {
  const { deceasedName, birthDate, deathDate, creatorEmail } = await req.json();

  if (!deceasedName || !birthDate || !deathDate || !creatorEmail) {
    return NextResponse.json({ error: "Chybí povinná pole" }, { status: 400 });
  }

  const baseSlug = generateSlug(deceasedName);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.memorialPage.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const memorial = await prisma.memorialPage.create({
    data: {
      slug,
      deceasedName,
      birthDate: new Date(birthDate),
      deathDate: new Date(deathDate),
      creatorEmail,
    },
  });

  return NextResponse.json({ id: memorial.id, slug: memorial.slug });
}
