export const COUNTRY_CODES = [
  "KR", "US", "JP", "GB", "CA", "AU", "FR", "DE", "BR", "MX",
  "PH", "VN", "TH", "ID", "IN", "CN", "TW", "HK", "SG", "MY",
  "ES", "IT", "NL", "SE", "NO", "FI", "PL", "AR", "CL", "PE",
  "RU", "TR", "SA", "AE", "EG", "ZA", "NZ", "PT", "BE", "CH",
];

export function countryFlagEmoji(code?: string) {
  if (!code || code.length !== 2) return "";
  const base = 127397;
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((c) => base + c.charCodeAt(0))
  );
}

export function countryLabel(code: string, locale: string) {
  try {
    const dn = new Intl.DisplayNames([locale], { type: "region" });
    return dn.of(code) ?? code;
  } catch {
    return code;
  }
}
