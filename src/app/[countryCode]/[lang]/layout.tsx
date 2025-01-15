import type { Metadata } from "next";
import "./globals.css";
import { getStrapiMedia, getStrapiURL } from "./utils/api-helpers";
import { fetchAPI } from "./utils/fetch-api";
import { i18n } from "../../../../i18n-config";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { FALLBACK_SEO } from "@/app/[countryCode]/[lang]/utils/constants";
import { ChakraProvider } from "@chakra-ui/react";
import BackgroundFetchComponent from './components/BackgroundFetchComponent';

async function getGlobal(lang: string): Promise<any> {
  const apiUrl = process.env.NEXT_PUBLIC_ISE_API_URL;

  if (!apiUrl)
    throw new Error("The API URL variable is not set.");

  const path = `/app/GLOBAL/${lang}/common`;

  return await fetchAPI(path, {}, {});
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const meta = await getGlobal(params.lang);
  if (!meta.data) return FALLBACK_SEO;

  const { metadata, favicon } = meta.data[0].attributes;
  return {
    title: metadata.metas.data[0].metaTitle,
    description: metadata.metas.data[0].metaDescription
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const global = await getGlobal(params.lang);
  // TODO: CREATE A CUSTOM ERROR PAGE
  if (!global.data) return null;

  const { navbar, footer } = global.data[0].attributes;

  const navbarLogoUrl = getStrapiMedia(navbar.navbarLogo.logoImg);
  return (
    <html lang={params.lang}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
        <meta name="theme-color" content="#fff" />
      </head>
      <body style={{ overflow: "hidden" }}>
        <ChakraProvider>
          <Navbar
            links={navbar.links.data}
            logoUrl={navbarLogoUrl}
            logoText={navbar.navbarLogo.logoText}
            title={navbar.title}
            hideTitle={navbar.hideTitle}
            hideHeader={navbar.hideHeader}
          />
          <BackgroundFetchComponent></BackgroundFetchComponent>
          <main
            className="p-6"
            style={{ maxHeight: "calc(100vh - 130px)", overflowX: "scroll" }}
          >
            {children}
          </main>

          <Footer
            menuLinks={footer.menuLinks.data}
            isMainMenu={footer.isMainMenu}
          />
        </ChakraProvider>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
