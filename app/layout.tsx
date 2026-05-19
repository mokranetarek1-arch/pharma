import type { Metadata } from "next";
import { AnimatedBackdrop } from "@/components/ui/animated-backdrop";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pharma Platform",
  description: "Recherche de medicaments, gestion de stock et administration multi-role."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="app-body">
        <AnimatedBackdrop />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
