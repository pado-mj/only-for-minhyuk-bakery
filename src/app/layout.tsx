import type { Metadata } from "next";
import { I18nProvider } from "@/lib/i18n/context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Only For Minhyuk Bakery",
  description: "2026. 11. 03 HBD MH 💙",
  openGraph: {
    title: "Only For Minhyuk Bakery",
    description: "2026. 11. 03 HBD MH 💙",
    images: [{ url: "/assets/og-image.png", width: 1536, height: 768, alt: "Only For Minhyuk Bakery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Only For Minhyuk Bakery",
    description: "2026. 11. 03 HBD MH 💙",
    images: ["/assets/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">
        <I18nProvider>
          <div className="app-shell">{children}</div>
        </I18nProvider>
      </body>
    </html>
  );
}
