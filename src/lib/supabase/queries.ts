import { createSupabaseAdminClient } from "@/lib/supabase/admin";
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

export const HOME_PAGE_SIZE = 30;
export type CakeSortMode = "new" | "mostViewed";

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

export async function fetchPublishedCakesPage({
  offset = 0,
  limit = HOME_PAGE_SIZE,
  sort = "new",
}: {
  offset?: number;
  limit?: number;
  sort?: CakeSortMode;
} = {}): Promise<{ cakes: CakeRecord[]; hasMore: boolean }> {
  const supabase = createSupabaseAdminClient();
  let query = supabase.from("cakes").select(SELECT_COLUMNS).eq("status", "published");

  query =
    sort === "mostViewed"
      ? query.order("view_count", { ascending: false }).order("created_at", { ascending: false })
      : query.order("created_at", { ascending: false });

  const { data, error } = await query.range(offset, offset + limit);

  if (error) {
    console.error("fetchPublishedCakesPage failed:", error.message);
    return { cakes: [], hasMore: false };
  }

  const rows = (data as unknown as CakeRow[]).map(mapRow);
  return { cakes: rows.slice(0, limit), hasMore: rows.length > limit };
}

export async function fetchPublishedCakes(limit = 500): Promise<CakeRecord[]> {
  const { cakes } = await fetchPublishedCakesPage({ limit });
  return cakes;
}

export async function fetchHomeStats() {
  const supabase = createSupabaseAdminClient();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalResult, todayResult, countriesResult] = await Promise.all([
    supabase.from("cakes").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("cakes").select("id", { count: "exact", head: true }).eq("status", "published").gte("created_at", startOfToday.toISOString()),
    supabase.from("cakes").select("country").eq("status", "published").not("country", "is", null),
  ]);

  if (totalResult.error) console.error("fetchHomeStats total failed:", totalResult.error.message);
  if (todayResult.error) console.error("fetchHomeStats today failed:", todayResult.error.message);
  if (countriesResult.error) console.error("fetchHomeStats countries failed:", countriesResult.error.message);

  const countries = new Set(
    (countriesResult.data ?? [])
      .map((row) => row.country)
      .filter((country): country is string => typeof country === "string" && country.length > 0)
  );

  return {
    total: totalResult.count ?? 0,
    today: todayResult.count ?? 0,
    countries: countries.size,
  };
}

export async function fetchCakeByPublicId(publicId: string): Promise<CakeRecord | null> {
  const supabase = createSupabaseAdminClient();
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
