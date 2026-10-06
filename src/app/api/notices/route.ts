import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ notices: [] });
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("notices")
    .select("id,title,body,locale,is_pinned,published_at")
    .eq("is_published", true)
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("notice fetch failed:", error);
    return NextResponse.json({ notices: [] });
  }

  return NextResponse.json({ notices: data ?? [] });
}
