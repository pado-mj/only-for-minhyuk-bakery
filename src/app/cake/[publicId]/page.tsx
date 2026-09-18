import { CakeDetailClient } from "@/components/cake/CakeDetailClient";
import { fetchCakeByPublicId } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function CakeDetailPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;
  const record = await fetchCakeByPublicId(publicId);
  return <CakeDetailClient record={record} />;
}
