// @ts-ignore
import nodemailer from "nodemailer";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const host = requireEnv("MAILEROO_SMTP_HOST");
  const port = Number(requireEnv("MAILEROO_SMTP_PORT"));
  const user = requireEnv("MAILEROO_SMTP_USER");
  const pass = requireEnv("MAILEROO_SMTP_PASS");
  const from = requireEnv("MAILEROO_FROM");

  if (!Number.isFinite(port) || port <= 0)
    throw new Error("MAILEROO_SMTP_PORT invalid");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildBrandedEmail(args: {
  title: string;
  bodyHtml: string;
  footerHtml?: string;
}) {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    ""
  ).trim();
  const brandName = "Eben Tours";
  const logoSrc = siteUrl ? `${siteUrl.replace(/\/$/, "")}/Logo-011.webp` : "";

  const safeTitle = escapeHtml(args.title);
  const footer =
    typeof args.footerHtml === "string" && args.footerHtml.trim()
      ? args.footerHtml
      : `<div style="border-top:1px solid rgba(30,86,49,0.10);padding-top:14px;font-size:12px;line-height:1.7;color:#64748b;font-weight:600;">\
You are receiving this email from ${brandName}.\
</div>`;

  const html = `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f7f5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f7f5;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid rgba(30,86,49,0.12);">
            <tr>
              <td style="padding:20px 22px;background:linear-gradient(135deg,#1e5631,#2d5a47);">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="left" style="vertical-align:middle;">
                      ${
                        logoSrc
                          ? `<img src="${logoSrc}" width="46" height="46" alt="${brandName} Logo" style="display:block;border-radius:12px;"/>`
                          : ""
                      }
                    </td>
                    <td align="right" style="vertical-align:middle;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;">
                      <div style="font-size:14px;color:rgba(255,255,255,0.9);font-weight:800;">${brandName}</div>
                      <div style="font-size:12px;color:rgba(255,255,255,0.75);font-weight:600;">${safeTitle}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 22px 18px 22px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;color:#0f172a;">
                ${args.bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:0 22px 22px 22px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;">
                ${footer}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { html, brandName };
}

export async function sendBrandedEmail(input: {
  to: string;
  subject: string;
  title: string;
  text?: string;
  bodyHtml: string;
  footerHtml?: string;
}) {
  const { html } = buildBrandedEmail({
    title: input.title,
    bodyHtml: input.bodyHtml,
    footerHtml: input.footerHtml,
  });

  await sendEmail({
    to: input.to,
    subject: input.subject,
    text: input.text,
    html,
  });
}
