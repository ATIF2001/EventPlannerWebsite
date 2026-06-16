import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GlobalApiLoader from "../components/GlobalApiLoader";
import SiteSettingsCssVars from "../components/next/SiteSettingsCssVars";
import AppFooterStrip from "../components/next/AppFooterStrip";
import { SiteContentProvider } from "../components/next/SiteContentProvider";
import { fetchPublicSettingsServer } from "./lib/seo";
import { SITE_NAME, DEFAULT_DESCRIPTION, SITE_URL, DEFAULT_IMAGE } from "../config/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_IMAGE, alt: SITE_NAME }],
  },
};

export default async function RootLayout({ children }) {
  const { settings, blocks } = await fetchPublicSettingsServer();
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo192.png`,
    sameAs: [
      "https://tiktok.com/@mk.4events",
      "https://www.instagram.com/mk.4events?igsh=MThnc3ZpdHM3cGV4cQ==",
      "https://www.snapchat.com/add/mk4events?share_id=mE8wrDeFJy8&locale=en-GB",
    ],
  };

  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <SiteContentProvider initialSettings={settings} initialBlocks={blocks}>
          <SiteSettingsCssVars settings={settings} />
          <GlobalApiLoader />
          <div className="app-shell fixed left-0 right-0 top-0 z-50 pt-6">
            <Navbar />
          </div>
          {children}
          <Footer />
          <AppFooterStrip />
        </SiteContentProvider>
      </body>
    </html>
  );
}

