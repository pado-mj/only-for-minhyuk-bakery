"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { dictionaries, locales, type Dictionary, type Locale } from "./dictionaries";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "ofmb_locale";

function detectLocale(): Locale {
  if (typeof window === "undefined") return "ko";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (locales as readonly string[]).includes(stored)) {
      return stored as Locale;
    }
  } catch {
    // ignore storage access issues
  }
  const nav = window.navigator.language?.slice(0, 2);
  if (nav === "ko" || nav === "ja" || nav === "en") return nav;
  return "ko";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ko");

  useEffect(() => {
    // Reads localStorage/navigator.language, which only exist client-side;
    // deferring to an effect keeps the server-rendered "ko" markup intact
    // for hydration instead of mismatching.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(detectLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage access issues
    }
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
