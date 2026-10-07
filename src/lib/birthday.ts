// MINHYUK's birthday: November 3 in KST (Asia/Seoul, UTC+9, no DST).
// Birthday effects are active only during Nov 3 00:00:00–23:59:59.999 KST.
export function isBirthdayLive(now: Date = new Date()): boolean {
  const kst = getKstNow(now);
  return kst.getUTCMonth() === 10 && kst.getUTCDate() === 3;
}

export function getKstNow(now: Date = new Date()): Date {
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}
