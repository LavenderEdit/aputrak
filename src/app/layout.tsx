import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import { SileoProvider } from "@/shared/components/providers/SileoProvider";
import { SyncProvider } from "@/shared/components/providers/SyncProvider";
import { ThemeProvider } from "@/shared/components/providers/ThemeProvider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aputrak — Schedule & Activity Manager",
  description: "Your offline-first schedule and activity planner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${dmSans.variable} ${outfit.variable}`}>
      <body>
        <SyncProvider>
          <ThemeProvider>
            <SileoProvider>{children}</SileoProvider>
          </ThemeProvider>
        </SyncProvider>
      </body>
    </html>
  );
}