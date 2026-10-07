import { HomeClient } from "@/components/home/HomeClient";
import { fetchHomeStats, fetchPublishedCakesPage, HOME_PAGE_SIZE } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [{ cakes, hasMore }, stats] = await Promise.all([
    fetchPublishedCakesPage({ limit: HOME_PAGE_SIZE, sort: "new" }),
    fetchHomeStats(),
  ]);

  return <HomeClient initialCakes={cakes} initialHasMore={hasMore} stats={stats} />;
}
