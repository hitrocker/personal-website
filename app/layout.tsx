import { JsonLd } from "@/components/json-ld";
import { retroFontVariables } from "@/designs/retro/fonts";
import { getSiteUrl, siteConfig } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "@/designs/retro/retro.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#008080",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <JsonLd />
        <div className={`retro-root ${retroFontVariables}`} suppressHydrationWarning>
          {/* Apply the saved wallpaper before first paint so there's no flash of the default teal. */}
          <script
            dangerouslySetInnerHTML={{
              __html:
                'try{var w=localStorage.getItem("maos-wallpaper");if(w&&/^(teal|navy|plum|crt)$/.test(w))document.currentScript.parentElement.dataset.wallpaper=w}catch(e){}',
            }}
          />
          {children}
        </div>
      </body>
    </html>
  );
}
