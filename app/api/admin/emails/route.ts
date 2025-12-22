import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { sendBrandedEmail } from "@/app/lib/mailer";

function isEmail(v: unknown) {
  if (typeof v !== "string") return false;
  const s = v.trim();
  if (!s) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const count = await prisma.customer.count();

  return NextResponse.json({ count });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);

  const subject = String(body?.subject ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (!subject)
    return NextResponse.json({ error: "subject required" }, { status: 400 });
  if (!message)
    return NextResponse.json({ error: "message required" }, { status: 400 });

  const customers = await prisma.customer.findMany({
    select: { email: true, name: true },
  });

  const targets = customers
    .map((c) => ({
      email: typeof c.email === "string" ? c.email.trim() : "",
      name: c.name,
    }))
    .filter((c) => isEmail(c.email));

  let sent = 0;
  let failed = 0;

  for (const t of targets) {
    try {
      const safeName = String(t.name).replace(/</g, "&lt;");
      const safeMessage = message
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br/>");

      await sendBrandedEmail({
        to: t.email,
        subject,
        title: subject,
        text: `Hi ${t.name},\n\n${message}\n\n— Eben Tours`,
        bodyHtml:
          `<div style=\"font-size:18px;font-weight:900;margin:0 0 10px 0;\">${subject.replace(
            /</g,
            "&lt;"
          )}</div>` +
          `<div style=\"font-size:14px;line-height:1.8;color:#334155;font-weight:600;\">` +
          `<p style=\"margin:0 0 12px 0\">Hi ${safeName},</p>` +
          `<p style=\"margin:0 0 14px 0\">${safeMessage}</p>` +
          `<p style=\"margin:0\">— Eben Tours</p>` +
          `</div>`,
      });
      sent += 1;
    } catch {
      failed += 1;
    }
  }

  return NextResponse.json({ ok: true, sent, failed });
}
