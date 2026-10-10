import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guard";

const types: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image first." }, { status: 400 });
  }

  const extension = types[file.type];
  if (!extension) {
    return NextResponse.json({ error: "Use a JPG, PNG, WEBP, or GIF." }, { status: 400 });
  }
  if (file.size > 6 * 1024 * 1024) {
    return NextResponse.json({ error: "Images need to be under 6 MB." }, { status: 400 });
  }

  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(directory, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(directory, filename), bytes);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
