// Deliberately not Intl.DateTimeFormat / toLocaleDateString: those can
// resolve differently between Node's SSR ICU data and the browser's,
// which throws a React hydration mismatch on any SSR'd date. Plain
// arithmetic + string formatting is identical everywhere.
export function formatDate(iso: string, locale: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();

  if (locale === "ko") return `${y}.${m}.${day}.`;
  if (locale === "ja") return `${y}/${m}/${day}`;
  return `${m}/${day}/${y}`;
}
