import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const previewNotices = [
  { id: 2, title: "NEW DECO UPDATED (26. 10. 07) !", body: "옹심 가나디, 리칭 가나디, 선물상자, 꽃다발 등이 추가되었어요!", locale: "ko", is_pinned: true, published_at: "2026-10-08T09:25:08.090Z" },
  { id: 1, title: "NEW DECO UPDATED !", body: "노래하는 가나디, 고래, 기타, 선글라스 등 요청해주신 데코가 업데이트 되었어요.", locale: "ko", is_pinned: false, published_at: "2026-10-07T07:30:31.911Z" },
  { id: 3, title: "민혁이의 생일상 OPEN", body: "First submission period: October 7–20, 2026.", locale: "ko", is_pinned: false, published_at: "2026-10-06T00:00:00.000Z" },
];

const isPreviewBranch = process.env.VERCEL_GIT_COMMIT_REF === "preview";

export async function GET() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ notices: isPreviewBranch ? previewNotices : [] });
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

  return NextResponse.json({ notices: isPreviewBranch ? previewNotices : (data ?? []) });
}
