import { NextRequest, NextResponse } from "next/server";
import { getUploadUrl, getPublicUrl } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  const { memorialId, fileName, contentType, orderIndex } = await req.json();

  if (!memorialId || !fileName || !contentType) {
    return NextResponse.json({ error: "Chybí parametry" }, { status: 400 });
  }

  const ext = fileName.split(".").pop();
  const key = `memorials/${memorialId}/${uuid()}.${ext}`;

  const uploadUrl = await getUploadUrl(key, contentType);
  const publicUrl = getPublicUrl(key);

  const photo = await prisma.memorialPhoto.create({
    data: {
      memorialId,
      r2Key: key,
      r2Url: publicUrl,
      orderIndex: orderIndex ?? 0,
    },
  });

  return NextResponse.json({ uploadUrl, publicUrl, photoId: photo.id });
}
