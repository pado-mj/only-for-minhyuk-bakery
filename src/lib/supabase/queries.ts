import { createSupabaseClient } from "@/lib/supabase/client";
import type { CakeRecord } from "@/types/cake";

interface CakeRow {
  id: string;
  public_id: string;
  public_number: number;
  nickname: string;
  country: string | null;
  letter: string;
  cake_data: CakeRecord["cakeData"];
  final_image_url: string | null;
  view_count: number;
  created_at: string;
  status: string;
}

const SELECT_COLUMNS =
  "id, public_id, public_number, nickname, country, letter, cake_data, final_image_url, view_count, created_at, status";

function mapRow(row: CakeRow): CakeRecord {
  return {
    id: row.id,
    publicId: row.public_id,
    publicNumber: row.public_number,
    nickname: row.nickname,
    country: row.country ?? undefined,
    letter: row.letter,
    cakeData: row.cake_data,
    finalImageUrl: row.final_image_url ?? undefined,
    viewCount: row.view_count,
    createdAt: row.created_at,
    status: row.status as CakeRecord["status"],
  };
}

// Fetches everything published, newest first. Fine at the current scale —
// once the table is large enough to matter, this should become a real
// paginated/sorted query per discovery mode instead of client-side
// sort+slice over the full set.
export async function fetchPublishedCakes(limit = 500): Promise<CakeRecord[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("cakes")
    .select(SELECT_COLUMNS)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("fetchPublishedCakes failed:", error.message);
    return [];
  }
  return (data as unknown as CakeRow[]).map(mapRow);
}

export async function fetchCakeByPublicId(publicId: string): Promise<CakeRecord | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("cakes")
    .select(SELECT_COLUMNS)
    .eq("public_id", publicId)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return mapRow(data as unknown as CakeRow);
}

export function computeStats(cakes: CakeRecord[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = cakes.filter((c) => new Date(c.createdAt) >= today).length;
  const countries = new Set(cakes.map((c) => c.country).filter(Boolean));
  return { total: cakes.length, today: todayCount, countries: countries.size };
}
