import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  JetBrains_Mono,
} from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "THE LORD Hair Salon",
    template: "%s | THE LORD Hair Salon",
  },

  description:
    "THE LORD Hair Salon à Sfax — coupes, barbe, brushing, soins et traitements capillaires.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}