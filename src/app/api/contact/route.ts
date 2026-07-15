import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";
import {
  ownerNotificationEmail,
  visitorAutoReplyEmail,
} from "@/lib/email-templates";

// Contact-form endpoint: validates the payload and relays it over SMTP to
// CONTACT_TO_EMAIL. SMTP credentials live in .env (see .env.example).

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

// Best-effort per-IP rate limit (in-memory, so per server instance — enough
// to stop casual abuse on a portfolio site without extra infrastructure).
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // keep the map from growing unboundedly
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  company?: string; // honeypot — humans never see or fill this field
}

function validate(body: unknown): { data?: ContactPayload; error?: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Invalid request body." };
  }
  const { name, email, message, company } = body as Record<string, unknown>;
  if (typeof name !== "string" || !name.trim()) return { error: "Name is required." };
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return { error: "A valid email is required." };
  }
  if (typeof message !== "string" || !message.trim()) {
    return { error: "Message is required." };
  }
  if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
    return { error: "One of the fields exceeds the allowed length." };
  }
  return {
    data: {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      company: typeof company === "string" ? company : undefined,
    },
  };
}

function getSmtpConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO_EMAIL) return null;
  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 465),
    secure: (process.env.SMTP_SECURE ?? "true") !== "false",
    user: SMTP_USER,
    pass: SMTP_PASS,
    to: CONTACT_TO_EMAIL,
    from: process.env.CONTACT_FROM_EMAIL || SMTP_USER,
  };
}

export async function POST(request: NextRequest) {
  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected JSON body." }, { status: 400 });
  }

  const { data, error } = validate(parsed);
  if (!data) {
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  // Honeypot tripped: report success so bots don't adapt, send nothing.
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages — please try again later." },
      { status: 429 }
    );
  }

  const smtp = getSmtpConfig();
  if (!smtp) {
    console.error("[contact] SMTP env vars missing — see .env.example");
    return NextResponse.json(
      { ok: false, error: "Mail service is not configured." },
      { status: 503 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
  });

  // 1. Notification to Bhavik — this one must succeed for the request to be OK.
  const notification = ownerNotificationEmail(data);
  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${smtp.from}>`,
      to: smtp.to,
      replyTo: `"${data.name.replaceAll('"', "")}" <${data.email}>`,
      subject: notification.subject,
      text: notification.text,
      html: notification.html,
    });
  } catch (err) {
    console.error("[contact] sendMail failed:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to send the message. Please try again or email directly." },
      { status: 502 }
    );
  }

  // 2. Thank-you auto-reply to the visitor — best-effort: their message is
  // already delivered, so a bouncing visitor address must not fail the request.
  const autoReply = visitorAutoReplyEmail(data);
  try {
    await transporter.sendMail({
      from: `"Bhavik Khorava" <${smtp.from}>`,
      to: data.email,
      replyTo: smtp.to,
      subject: autoReply.subject,
      text: autoReply.text,
      html: autoReply.html,
    });
  } catch (err) {
    console.error("[contact] auto-reply failed (non-fatal):", err);
  }

  return NextResponse.json({ ok: true });
}
