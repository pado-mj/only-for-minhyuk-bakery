"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "minhyuk-uchiwa-event-dismissed-v1";
const EVENT_URL = "https://x.com/HBD_bakery_MH/status/2107652901527331099";
const PHOTO = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABgQEhUSDxgVExUaGRgcIzsmIyAgI0gzNis7VUtaWFRLUlFeaodzXmSAZVFSdqB3gIyQl5mXW3GmsqWTsIeUl5L/2wBDARkaGiMfI0UmJkWSYVJhkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpL/wAARCADcANwDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAAECAwQFBv/EADMQAAICAQMCBQIEBQUBAAAAAAABAhEDEiExBEETIlFhcQUyFIGRoSMzQlKxBnLB0eFi/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAfEQEBAQEAAgMBAQEAAAAAAAAAARECITEDElFBEzL/2gAMAwEAAhEDEQA/APTgAEaIABugABWAVMCNj1BMMBNpK2VTyv8Ap2BJq1uuRa4/3L9SjS3u7b9yMsbt7oNTmNSafDsDE4uCT3T9izHnkvuWpeoX6fjSAoyUladoYYAgC/QKXIxDAAAAGAAEMWpCk6RGlXuFxYBGHBIIQAQyS0rblgEp1suRJd5MrJxezTDeYk137BZVlzRw43Ob2X7nC6z6llzNqL0xTql3foDHU6v6p0/TOnLXJdo/9mRf6hwaqeOX5M42aMUvO9Unz/4Y5NRl31dkB6mH1rDlbpbdldNkofUsWSemK/WSR5TGqnB9reprZp+ppcpp7vdd0ayM69ZjyLMnoTtcp8g5SXdo81h+q5uleqDdJ04s9F0P1DD1mJTjSl3RLGp0sjld1KqapsHPTcYVT9dy2ST5SIPCnvF0RZYMbcN079TRFqStGeVpU6/IljlUvZhLN8rhgAYKtx0NIAaKAACChUMAFyJxvgbW9oAoWyGAAIom7lfbsXSdRb9jPbpLsg1yCyMG43+gktbuqQ8mRY8TklxwvVhbXP8ArKwQ6VvJN+L/AEq/+DzqyLnbRHe12/8ASX1rJOfUzjKTvujLgypxcZevAL4TnOdPK1eSXbtFdkip43CLu3LmTG8jyZVHsti3LK8s1ykmaZUYPLKSbtrcnGbdNdlX6FuHpm1PJW3BCS8NaV3GmISrxKT2ku/qavovUvD1kU3UZPTL8+DBJ3NS9C3pHCXU4dcnCMpK5LsKc+3s4uUX5X+RfjlqXo+6MryJO/8ABPXTtLcw3Zq6UW2Q4LIzUlYNKRWZcWQdxTJEMWypkwydi7/AmvR0NJUEUZs2aHU4YY8Lnjm3rnf2k/Gf4h49Hl06vE1KvgtoWmPovXgDP02TNPNnWXDLHGMqg3K9S9TRdP5HQbVuAWRjvfoRirJrYKYCGBXN+Rlccbb32ROX2snFbKw1uQmkl6JGa/Fya/6Y/b7+5b1M9MNK5lsitVCNdkgcvNf6hw+D12tLy5Vf58M468mSKvZySZ636p4OTppTy4lkcU9CrdNnkMkXGW+7UmItTxTrK/8AdZfvLLKuGGLptWaElvGR3MP06PO1NXfuLSRPD0q/BSglu0cvNgcsMZ6ezf6f+WejjBRx17GDqMmPHFYsUHOS4S7GV15/JhbhKS5TKcacZpen+Tu4elnKVzcYRvePLM31DpFh6zp3GNxnJX+TNRMeiliU0pW02l+Y46ov1Le+/AZNHEERtXrS3X5jWWnsNQU3xYlii5K7QZsacXBYQp6WounVIqhkyRzaMjTtXdFYk1oDaiueVxzRhSpqxzlGNau7pAxLWGtAvYhiyeI5bVToJieoJLZkMuVY6Wlyb4SDVcHKpLa6YXE1wMqxzlkw2qUmtiCyZYZYxm01L2GrjQBTiySlkyJ8J0i4JZitk3JKJArzyccd9gWOd9WzSlpxwbuUu3sLFLNkklKTm/8AAZIvJni6ukbcGNY4/wD0+TLc9FDAkpa/M5Kmu1Hm+r+n+H1sYLdNrc9X6GXrekXUQk47TSuL9yjnY/p2PBi/iZJKK+2vQo8SH4hYoYuqbavU3W3J3cdTxRk1Ta3XuRniTe7delkTVHS45ShUm/a+TJm6SWSU46nFO15eTr4kr2M+ZaMrfYGuf0v06GKMV5pONvVLlmrJ0/izwbfZO/2L9ScdizFwWCTFVPckKubYaJDiraQr2otww7sFuRbFbFCfidU5R4iqv3NJFRSdpFc5cZ87l+JjoSbUe4s0pOGN5EotS7F/hrxHPuyUkpKmrRMa+3pHHlhPaMk2jNiWRuTxySTk+UalCKeyohDw8cnBSSd8WEl/FeduLxSl2e7LFkhPFLQ06W4smaEZaWm33pcEoKE43FbML/PKvA3Hp00nJpcEZZXOa/gvVH34L4QUI6VwLw0sjmuXyDZtV9P/ADcn+40FUMejJKV7SdlpYz15qsTSap7pjAKo8NQey57lkVx3sk1aINOD/wCQ0bVMZFEkAmkouvkz5W62NXJTnxOnFkrKFzjBaKfyZM+Wcsn8SShH55L/AMPBRpX+rKpdMotNpexGpgx5FNvSnXq1ybMMair7meKS3Zp6WepS7q6LGbcXrHFblEt2aNFqlJpehGax41xql2TLhKqhHU/Y0pUihSk92/0JILZauEQTaGpeoZxIr6hN4J16Fid8ByCeKyzyOWHGotpya4Ix1LLOsak9XPoWw6eMJ6k2/T2Hk6eM5ak2n3pkxvZ6U5nKGaTgvujwXdLXhKnYLAlpdu48WyUcUYz1RVNhLZZiwAArIAQwiA6BIYUUFJqmABFUsbX27jjjm+xYNNrgLtEMdO2+COdVFy7dyyMk9u43uVnWBziZ8k1q3ki3q+nlheqH8t9v7TFJyT3VnO3HWSUdR1FRdcI6PQYnj6aGr7mrfyzn9P0/j9RCMltdv4R1suTR5Y/d/g1x+p3P5EsmRY1S3l6FajF1OTbb5IRTb9WxPNBRUb7mtWcZ6WyVS4oEyCyxkktSZIi5+pWMjY7CC6LItNWVVd78Eb2CZq5ziuWR8aPuUsJrS6DU4i7xod3XyiaaatNNGKRGMnF3FtML/n+OgIqw51PaW0v8lrDlZZcpBYwAAAAhhQgQAACQU2xqTXuiPZjCVJ6Zxae6fKZzsuHwsji912fsbxOGppveuBZqzwz9NhcJa+HQPdt+pon5cbozpJvd0hJjfP6rzSqO3c0YOlx+EnONyaszTWvPGC9aOkF+TqySRmn0WN/a3H9yp9Nmh9kk18jn1k45ZJJOKdI145OeOMmqtXQ8Jeu+Z5YY5ZRlpyqn6jfURXCbJfUGtcF3o0YsEIY0nFN1vaDV65klsUQyRnx+g6bKs+Nw6isK3q6QnPMnp0tSe3AXN8xYxrHOStIqlDPjWqS2/U14pTnhjJUnW1hOrk2MuTHKH3KvcrOgvMmpwpe7uzDkWjJJLsyNcd/bwiuzV/Jtw5Ncd+UYkX4npkgfJNjUAhlcCAACAAAAAACk7oYAADAAiGb+W/kzmnKrxszFdePSOBpdXctuaOgc7Fj/ABGZpukuTTPFLFjcsWSXlV03aJD5JLZ58oT6FN+Wb/M1pUqXYww62a++KfxsXLrMbi+U64aHhnrnu+1Ev43XV2Tr9DeYugjqySm+yNeWWjHKXohD5Pc5jPgnr6rLta9fSjUZfp68k33sl10nHCkrVumwdc739Y0NJpp8MyS6WWPzYsjtdmWdFq8C5Nu3tY+pzeE4LapPf4CTeevrGV58mWMccb1N8ruOfS5YxcrUvVI3R0yScaa7UE5aYSk+ysY1/plzmObjdlhXi7ssMu3Xtqg7iiRDF9iJmnmIAI8gOxisYAADQBQABUAABANWqMc7ipeqNhRnj5r7MN8XyX09LRN97o0ZoynilGNJtVuYYvJgk3j3T7F0OuXE4NfAla746vX2jPPp8sOYNr23Kjpw6jFPiaT9HsTlCE15oqSGL/tZ/wBRT0SSwX3bsXXTrEo/3MlLpMd3Byg/ZmTqY5ITUZzcqWzCcydd7qXSyyY25RhKUHzRtjkxzVWvh8lPTdRj8KMG1FpVuXtQmt0pL9RGfku3zDcowVtpJGWEodT1LclaivKn3LJ9JilwnH4ZTLopxd45p/OwOfr++WuGOEL0RSvmirrZacFf3OiUcihBLJqVLdv/ALM3WzWTJCMWmkuwpxzb15Qxqoqycqb2VIiSgrkjLrf1pxqokhJbDNPOiFAMKW46BDAABOwCCwAAAAAAFKOqLQwAzVTp8jcE0rSdlmSF+ZcogiOu6rl08HxaI+Fkx745/vRoEFnVVLqM8Pujq+UQ8+bLrmqSNEdN+Yi6vbgEs/kVyxRfavggsc4O4Ta/YvVWr4LXCCTfAL3Z4Zo9Rnh93mXui/B1SyzUHBpsqe7IdJOEMspZHW2w1bzLLcdA5lLx5aeE3Rvllj4UpxknSvZmDEtmy1n4pkqZfhh3fchjhqdvg0pUiSJ31/AAAVzIEMAAja3pN13HK6VeoJpXv70FLdtbcEhan5Uu4La74TAYr3oE7brsK6d+vYCQAAQAAABXONO1wWByFlxUlfwiWn8vZCktLIka9m4r1a2sTjUdw1NcDU91av3C+UKB2WNKMk+92Vzlqd0l8BZdRZXKEXyibHHHKXsRvcUeGuzNGLDsr49C2GJR+SzguMdfJb4hJUMYFciAAAAAAE+AS8tMYAJ2ls+BJpLv/wBjatUOtqQUtkuXs+wRVtt7Xwgqlt+4LV3dtgCd0/2HaS3I2oqk2q9VyK7XF3+wMO7pR/UkABAAAANWqZS006ZeRlHUhVlxUInoY1D1JjX2iumxrG3yXKKQy4n2qEcaRJKhitPgMmKXAxVvYEd4okrrcU+CQUCGAQgAAAAAAAAAAAYEad7tsYwAAAAAAABbhYyL5Ad7jFW4wAAAAEopfIwAAAAAAAAAAA//2Q==";

export function UchiwaEventPopup() {
  const [open, setOpen] = useState(false);
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
        <h2 id="uchiwa-event-title" className="mt-1 text-[20px] font-black text-[#9e5069]">🎀 민혁이 우치와 이벤트 🎀</h2>
        {/* Embedded from the supplied prize image, so it does not depend on an external image host. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PHOTO} alt="분홍색 하트 모양 민혁 우치와 앞면과 뒷면 경품 사진" className="mx-auto mt-3 aspect-square w-full max-w-[280px] rounded-xl object-cover" />
        <p className="mt-3 text-[13px] font-bold leading-6 text-[#6c4751]">이벤트 트윗을 재게시하거나 인용하면<br />추첨을 통해 우치와를 드려요! 💗</p>
        <p className="mt-2 rounded-xl bg-white/75 px-3 py-2 text-[12px] leading-5 text-[#8c5264]">인용할 땐 <strong>#지금도빛나는민혁이에게</strong><br />해시태그와 함께 민혁이의 반짝거림을 널리 알려주세요 ✨</p>
        <a href={EVENT_URL} target="_blank" rel="noopener noreferrer" className="mt-4 flex w-full items-center justify-center rounded-full bg-[#e68da8] px-4 py-3 text-[14px] font-extrabold text-white shadow-sm">X에서 이벤트 참여하기 ↗</a>
        <div className="mt-3 flex items-center justify-center gap-5 text-[12px] font-semibold text-[#916d76]">
          <button type="button" onClick={() => setOpen(false)} className="py-2 underline underline-offset-4">닫기</button>
          <button type="button" onClick={dismissForever} className="py-2 underline underline-offset-4">다시 보지 않기</button>
        </div>
      </section>
    </div>
  );
}
