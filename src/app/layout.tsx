import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

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
    <html lang="ja" suppressHydrationWarning>
      <body
        className="antialiased font-sans"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <ScrollToTop />
          <Toaster position="bottom-right" richColors closeButton theme="system" />
        </ThemeProvider>
      </body>
    </html>
  );
}
