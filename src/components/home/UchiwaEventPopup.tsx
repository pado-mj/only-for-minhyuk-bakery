"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "minhyuk-uchiwa-event-dismissed-v1";
const EVENT_URL = "https://x.com/HBD_bakery_MH/status/2107652901527331099";
const PHOTO = "/assets/uchiwa-event.png";

export function UchiwaEventPopup() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTag = async () => {
    try {
      await navigator.clipboard.writeText("#지금도빛나는민혁이에게");
      setCopied(true);
    } catch { setCopied(false); }
  };
  useEffect(() => {
    try { setOpen(localStorage.getItem(STORAGE_KEY) !== "true"); }
    catch { setOpen(true); }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;
  const dismissForever = () => {
    try { localStorage.setItem(STORAGE_KEY, "true"); } catch {}
    setOpen(false);
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#342b2b]/55 px-5 py-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="uchiwa-event-title" className="relative w-full max-w-[370px] max-h-[94dvh] overflow-y-auto rounded-[26px] border-[3px] border-[#f4b9c9] bg-[#fff6f5] px-5 pb-5 pt-5 text-center shadow-2xl">
        <button type="button" onClick={() => setOpen(false)} aria-label="닫기" className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg font-bold text-[#a66578]">×</button>
        <p className="text-[11px] font-extrabold tracking-[0.18em] text-[#d7839c]">SPECIAL GIVEAWAY</p>
        <h2 id="uchiwa-event-title" className="mt-1 text-[20px] font-black text-[#9e5069]">🎀 가나디귀 하트우치와 🎀</h2>
        {/* Embedded from the supplied prize image, so it does not depend on an external image host. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PHOTO} alt="가나디귀 하트우치와 경품 이미지" className="mx-auto mt-3 aspect-square w-full max-w-[280px] rounded-xl object-cover" />
        <p className="mt-3 text-[13px] font-bold leading-6 text-[#6c4751]">이벤트 트윗을 재게시하거나 인용하면<br />추첨을 통해 우치와를 드려요! 💗</p>
        <p className="mt-2 rounded-xl bg-white/75 px-3 py-2 text-[12px] leading-5 text-[#8c5264]">인용할 땐 아래 해시태그와 함께<br />민혁이의 반짝거림을 널리 알려주세요 ✨<span className="mt-2 flex flex-wrap items-center justify-center gap-2"><strong>#지금도빛나는민혁이에게</strong><button type="button" onClick={copyTag} className="rounded-full border border-[#e68da8] bg-white px-3 py-1 text-[11px] font-bold text-[#9e5069]">{copied ? "복사 완료 ✓" : "복사하기"}</button></span></p>
        <a href={EVENT_URL} target="_blank" rel="noopener noreferrer" className="mt-4 flex w-full items-center justify-center rounded-full bg-[#e68da8] px-4 py-3 text-[14px] font-extrabold text-white shadow-sm">X에서 이벤트 참여하기 ↗</a>
        <div className="mt-3 flex items-center justify-center gap-5 text-[12px] font-semibold text-[#916d76]">
          <button type="button" onClick={() => setOpen(false)} className="py-2 underline underline-offset-4">닫기</button>
          <button type="button" onClick={dismissForever} className="py-2 underline underline-offset-4">다시 보지 않기</button>
        </div>
      </section>
    </div>
  );
}
