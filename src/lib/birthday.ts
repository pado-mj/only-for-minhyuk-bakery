// MINHYUK's birthday: November 3, 00:00 KST (Asia/Seoul, UTC+9, no DST).
// KST has a fixed offset, so we can compare against a UTC instant directly:
// Nov 3 00:00 KST == Nov 2 15:00 UTC of the same year.
export function isBirthdayLive(now: Date = new Date()): boolean {
  const year = getKstYear(now);
  const cutoffUtc = Date.UTC(year, 10, 2, 15, 0, 0); // Nov 2, 15:00 UTC = Nov 3, 00:00 KST
  return now.getTime() >= cutoffUtc;
}

function getKstYear(now: Date): number {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.getUTCFullYear();
}

export function getKstNow(now: Date = new Date()): Date {
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}
