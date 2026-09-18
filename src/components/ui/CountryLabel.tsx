"use client";

import { useEffect, useState } from "react";
import { countryLabel } from "@/lib/countries";

// Intl.DisplayNames can resolve a region's localized name differently
// between Node's SSR ICU data and the browser's (seen for "HK"), which
// throws a hydration mismatch for any component SSR'd with real country
// data. Render the raw code on the first paint (identical server/client)
// and swap in the localized label only after mount.
export function CountryLabel({ code, locale }: { code: string; locale: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);
  return <>{ready ? countryLabel(code, locale) : code}</>;
}
