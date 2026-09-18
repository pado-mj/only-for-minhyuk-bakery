import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generatePublicId } from "@/lib/id";
import type { CakeData, CanvasObject } from "@/types/cake";

const VALID_OBJECT_TYPES = ["image", "decoration", "topper", "candle"];
const VALID_LAYERS = [2, 3, 4, 5];
const MAX_OBJECTS = 120;

function isValidObject(o: unknown): o is CanvasObject {
  if (!o || typeof o !== "object") return false;
  const obj = o as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.assetId === "string" &&
    VALID_OBJECT_TYPES.includes(obj.type as string) &&
    typeof obj.x === "number" &&
    obj.x >= 0 &&
    obj.x <= 1080 &&
    typeof obj.y === "number" &&
    obj.y >= 0 &&
    obj.y <= 1080 &&
    typeof obj.scale === "number" &&
    obj.scale > 0 &&
    obj.scale <= 4 &&
    typeof obj.rotation === "number" &&
    typeof obj.zIndex === "number" &&
    VALID_LAYERS.includes(obj.layer as number)
  );
}

function isValidCakeData(data: unknown): data is CakeData {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  const bg = d.background as Record<string, unknown> | undefined;
  if (!bg || typeof bg.color !== "string" || !/^#[0-9a-fA-F]{6}$/.test(bg.color)) return false;
  if (typeof d.cakeColor !== "string" || !/^#[0-9a-fA-F]{6}$/.test(d.cakeColor)) return false;
  if (!Array.isArray(d.objects) || d.objects.length > MAX_OBJECTS) return false;
  return d.objects.every(isValidObject);
}

interface CreateCakePayload {
  nickname: string;
  country?: string;
  letter: string;
  cakeData: CakeData;
}

function validatePayload(body: unknown): { ok: true; data: CreateCakePayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid payload" };
  const b = body as Record<string, unknown>;

  if (typeof b.nickname !== "string" || b.nickname.trim().length < 1 || b.nickname.length > 20) {
    return { ok: false, error: "Nickname must be 1-20 characters" };
  }
  if (typeof b.letter !== "string" || b.letter.trim().length < 1 || b.letter.length > 500) {
    return { ok: false, error: "Letter must be 1-500 characters" };
  }
  if (b.country !== undefined && (typeof b.country !== "string" || b.country.length > 2)) {
    return { ok: false, error: "Invalid country code" };
  }
  if (!isValidCakeData(b.cakeData)) {
    return { ok: false, error: "Invalid cake data" };
  }

  return {
    ok: true,
    data: {
      nickname: b.nickname.trim(),
      country: b.country as string | undefined,
      letter: (b.letter as string).trim(),
      cakeData: b.cakeData as CakeData,
    },
  };
}

// Simple in-memory rate limit (best-effort only; a single serverless
// instance's memory does not span the whole deployment). Real abuse
// protection should sit in front of this route (e.g. Vercel WAF / Upstash
// rate limiting) before Phase 6 hardening ships.
const recentSubmissions = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip: string) {
  const last = recentSubmissions.get(ip);
  const now = Date.now();
  if (last && now - last < RATE_LIMIT_WINDOW_MS) return true;
  recentSubmissions.set(ip, now);
  return false;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests, please slow down." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON" }, { status: 400 });
  }

  const result = validatePayload(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Supabase is not configured yet. This endpoint is ready for Phase 3." },
      { status: 501 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const publicId = generatePublicId();

  const { data, error } = await supabase
    .from("cakes")
    .insert({
      public_id: publicId,
      nickname: result.data.nickname,
      country: result.data.country,
      letter: result.data.letter,
      cake_data: result.data.cakeData,
      status: "published",
    })
    .select("public_id, public_number")
    .single();

  if (error) {
    console.error("cakes insert failed:", error);
    return NextResponse.json({ error: "Failed to save cake" }, { status: 500 });
  }

  return NextResponse.json({ publicId: data.public_id, publicNumber: data.public_number }, { status: 201 });
}
