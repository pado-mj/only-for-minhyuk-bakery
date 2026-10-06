import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const VALID_LOCALES = ["ko", "en", "ja"];

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Malformed JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const b = body as Record<string, unknown>;
  const text = typeof b.request === "string" ? b.request.trim() : "";
  const locale = typeof b.locale === "string" && VALID_LOCALES.includes(b.locale) ? b.locale : "ko";
  if (!text || text.length > 80) return NextResponse.json({ error: "Request must be 1-80 characters" }, { status: 400 });
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("decoration_requests").insert({ request_text: text, locale });
  if (error) {
    console.error("decoration request insert failed:", error);
    return NextResponse.json({ error: "Failed to save request" }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
