import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);

    const timestampRaw = searchParams.get("timestamp");
    const timestamp = timestampRaw
      ? Number(timestampRaw)
      : Math.floor(Date.now() / 1000);

    const folder = String(
      searchParams.get("folder") ??
        process.env.CLOUDINARY_FOLDER ??
        "eben-tours/packages"
    ).trim();

    const publicId = String(searchParams.get("public_id") ?? "").trim();

    if (!Number.isFinite(timestamp) || timestamp <= 0)
      return NextResponse.json({ error: "timestamp invalid" }, { status: 400 });

    const cloudName = requireEnv("CLOUDINARY_CLOUD_NAME");
    const apiKey = requireEnv("CLOUDINARY_API_KEY");
    const apiSecret = requireEnv("CLOUDINARY_API_SECRET");

    const paramsToSign: Record<string, string> = {
      folder,
      timestamp: String(timestamp),
    };

    if (publicId) paramsToSign.public_id = publicId;

    const toSign = Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join("&");

    const signature = crypto
      .createHash("sha1")
      .update(`${toSign}${apiSecret}`)
      .digest("hex");

    return NextResponse.json({
      cloudName,
      apiKey,
      folder,
      timestamp,
      signature,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ? String(err.message) : "Failed to sign upload" },
      { status: 500 }
    );
  }
}
