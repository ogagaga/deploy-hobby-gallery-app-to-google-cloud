import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { ScrollToTop } from "@/components/layout/scroll-to-top";

export const metadata: Metadata = {
  title: "Hobby Gallery",
  description: "プラモデル完成品ギャラリー",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className="antialiased font-sans"
      >
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <ScrollToTop />
      </body>
    </html>
  );
}
