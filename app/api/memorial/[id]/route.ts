import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const memorial = await prisma.memorialPage.findUnique({
    where: { id },
    include: { photos: { orderBy: { orderIndex: "asc" } } },
  });
  if (!memorial) {
    return NextResponse.json({ error: "Nenalezeno" }, { status: 404 });
  }
  return NextResponse.json(memorial);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const memorial = await prisma.memorialPage.update({
    where: { id },
    data: body,
  });
  return NextResponse.json(memorial);
}
