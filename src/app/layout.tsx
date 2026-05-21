import type { Metadata } from "next";
import { SileoProvider } from "@/shared/components/providers/SileoProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApuTrak | Tu Horario Local",
  description: "Planifica tu semana de forma segura y offline",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <SileoProvider>{children}</SileoProvider>
      </body>
    </html>
  );
}