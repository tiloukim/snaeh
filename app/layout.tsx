import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Battambang } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

const battambang = Battambang({
  variable: "--font-battambang",
  subsets: ["khmer"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://snaeh.vercel.app"),
  title: "SnaehApp — Find Love in Cambodia",
  description:
    "Cambodia's #1 dating app. Connect with Cambodian hearts through authentic culture, shared values, and modern technology. Bilingual Khmer–English.",
  keywords: ["cambodia", "dating", "khmer", "love", "snaeh", "match"],
  openGraph: {
    title: "SnaehApp — Find Love in Cambodia",
    description:
      "Cambodia's #1 dating app connecting hearts through culture, values, and technology.",
    url: "https://snaeh.com",
    siteName: "SnaehApp",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${montserrat.variable} ${battambang.variable}`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
