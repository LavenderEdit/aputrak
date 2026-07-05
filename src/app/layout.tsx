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
    <html lang="es" suppressHydrationWarning className={`${dmSans.variable} ${outfit.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://ataraxia-api.studios-tkoh.online; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()" />
      </head>
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