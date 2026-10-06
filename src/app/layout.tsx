import type { Metadata } from "next";
import { I18nProvider } from "@/lib/i18n/context";
import "./globals.css";

export const metadata: Metadata = {
  title: "· ｡ ✧ 민혁이의 생일상 🎂 ✧ ｡ ·· ｡",
  description: "· ｡ ✧ 민혁이의 생일상을 함께 채워주세요 ♡ ✧ ｡ · · ｡ ✧ ᴏɴʟɪɴᴇ ʙɪʀᴛʜᴅᴀʏ ᴄᴀꜰᴇ ꜰᴏʀ ᴍɪɴʜʏᴜᴋ✧ ｡ ·",
  icons: {
    icon: "/assets/fabicon.png",
    shortcut: "/assets/fabicon.png",
    apple: "/assets/fabicon.png",
  },
  openGraph: {
    title: "· ｡ ✧ 민혁이의 생일상 🎂 ✧ ｡ ·· ｡",
    description: "· ｡ ✧ 민혁이의 생일상을 함께 채워주세요 ♡ ✧ ｡ · · ｡ ✧ ᴏɴʟɪɴᴇ ʙɪʀᴛʜᴅᴀʏ ᴄᴀꜰᴇ ꜰᴏʀ ᴍɪɴʜʏᴜᴋ✧ ｡ ·",
    images: [{ url: "/assets/og-image.png", width: 1536, height: 768, alt: "· ｡ ✧ 민혁이의 생일상 🎂 ✧ ｡ ·· ｡" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "· ｡ ✧ 민혁이의 생일상 🎂 ✧ ｡ ·· ｡",
    description: "· ｡ ✧ 민혁이의 생일상을 함께 채워주세요 ♡ ✧ ｡ · · ｡ ✧ ᴏɴʟɪɴᴇ ʙɪʀᴛʜᴅᴀʏ ᴄᴀꜰᴇ ꜰᴏʀ ᴍɪɴʜʏᴜᴋ✧ ｡ ·",
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
