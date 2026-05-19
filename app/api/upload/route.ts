import { NextRequest, NextResponse } from "next/server";
import { r2Client, getPublicUrl } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const memorialId = formData.get("memorialId") as string;
  const orderIndex = Number(formData.get("orderIndex") ?? 0);
  const file = formData.get("file") as File | null;

  if (!memorialId || !file) {
    return NextResponse.json({ error: "Chybí parametry" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const key = `memorials/${memorialId}/${uuid()}.${ext}`;

  const bytes = await file.arrayBuffer();
  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: key,
      Body: Buffer.from(bytes),
      ContentType: file.type,
    })
  );

  const publicUrl = getPublicUrl(key);

  const photo = await prisma.memorialPhoto.create({
    data: {
      memorialId,
      r2Key: key,
      r2Url: publicUrl,
      orderIndex,
    },
  });

  return NextResponse.json({ publicUrl, photoId: photo.id });
}
