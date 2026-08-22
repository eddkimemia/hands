import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Script from "next/script";
import { CartProvider } from "@/components/cart/CartContext";
import { CurrencyProvider } from "@/components/cart/CurrencyContext";
import { FloatingChat } from "@/components/site/FloatingChat";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { HideOnAdmin } from "@/components/site/HideOnAdmin";
import { TopBar } from "@/components/site/TopBar";
import { getSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/utils";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz"],
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ishara Charity — Extending Hands. Inspiring Hope.",
    template: "%s | Ishara Charity",
  },
  description:
    "Ishara Charity is a Kenyan community foundation improving lives through compassion, empowerment, education, health support, food security and community development.",
  keywords: [
    "NGO Kenya",
    "community foundation Kenya",
    "charity Kenya",
    "education Kenya",
    "health outreach Kenya",
    "food security",
    "youth empowerment",
    "volunteer Kenya",
    "donate Kenya",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "Ishara Charity",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: settings.orgName,
    alternateName: "Ishara Charity",
    slogan: settings.tagline,
    description: settings.missionShort,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    areaServed: { "@type": "Country", name: "Kenya" },
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.location,
      addressCountry: "KE",
    },
    email: settings.emailGeneral || undefined,
    sameAs: settings.socials.filter((s) => s.url).map((s) => s.url),
  };

  return (
    <html lang="en-KE" className={`${display.variable} ${sans.variable}`}>
      <body>
        <CurrencyProvider>
          <CartProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy-900 focus:px-5 focus:py-2.5 focus:text-sm focus:text-white"
          >
            Skip to content
          </a>
          <HideOnAdmin>
            <Header />
          </HideOnAdmin>
          <main id="main-content">{children}</main>
          <HideOnAdmin>
            <Footer />
            <FloatingChat />
          </HideOnAdmin>
        </CartProvider>
        </CurrencyProvider>

        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
