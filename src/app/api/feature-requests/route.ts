import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Malformed JSON" }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const payload = body as Record<string, unknown>;
  const text = typeof payload.request === "string" ? payload.request.trim() : "";
  const type = payload.type === "bug" || payload.type === "message" ? payload.type : "feature";
  if (!text || text.length > 120) return NextResponse.json({ error: "Request must be 1-120 characters" }, { status: 400 });
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  const supabase = createSupabaseAdminClient();
  let { error } = await supabase.from("feature_requests").insert({ request_text: text, type });
  // Keep production usable until the type migration has been applied.
  if (error && /type/i.test(error.message)) {
    ({ error } = await supabase.from("feature_requests").insert({ request_text: text }));
  }
  if (error) { console.error("feature request insert failed:", error); return NextResponse.json({ error: "Failed to save request" }, { status: 500 }); }
  return NextResponse.json({ ok: true }, { status: 201 });
}
