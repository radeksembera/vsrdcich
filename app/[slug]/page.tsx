import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const memorial = await prisma.memorialPage.findUnique({ where: { slug } });
  if (!memorial) return { title: "Stránka nenalezena" };
  return {
    title: `${memorial.deceasedName} – VSrdcich`,
    description: `Vzpomínková stránka věnovaná ${memorial.deceasedName}`,
  };
}

export default async function MemorialPage({ params }: Props) {
  const { slug } = await params;
  const memorial = await prisma.memorialPage.findUnique({ where: { slug } });

  if (!memorial || memorial.status === "DRAFT") {
    notFound();
  }

  if (!memorial.generatedHtml) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf6ef]">
        <p className="text-[#a08060]">Stránka se připravuje...</p>
      </div>
    );
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: memorial.generatedHtml }}
    />
  );
}
