import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVariableSymbol } from "@/lib/slug";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { memorialId, fullName, email, street, city, postalCode } =
    await req.json();

  if (!memorialId || !fullName || !email || !street || !city || !postalCode) {
    return NextResponse.json({ error: "Chybí povinná pole" }, { status: 400 });
  }

  const memorial = await prisma.memorialPage.findUnique({
    where: { id: memorialId },
  });
  if (!memorial) {
    return NextResponse.json({ error: "Stránka nenalezena" }, { status: 404 });
  }

  const variableSymbol = generateVariableSymbol();

  const order = await prisma.order.create({
    data: {
      memorialId,
      fullName,
      email,
      street,
      city,
      postalCode,
      variableSymbol,
      amount: 399,
    },
  });

  await prisma.memorialPage.update({
    where: { id: memorialId },
    data: { status: "ORDERED" },
  });

  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${memorial.slug}`;

  await sendOrderConfirmation({
    email,
    fullName,
    deceasedName: memorial.deceasedName,
    variableSymbol,
    amount: 399,
    pageUrl,
  });

  return NextResponse.json({
    orderId: order.id,
    variableSymbol,
    amount: order.amount,
    bankAccount: process.env.BANK_ACCOUNT,
  });
}
