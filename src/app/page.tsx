import { HomeClient } from "@/components/home/HomeClient";
import { computeStats, fetchPublishedCakes } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cakes = await fetchPublishedCakes();
  const stats = computeStats(cakes);
  return <HomeClient cakes={cakes} stats={stats} />;
}
