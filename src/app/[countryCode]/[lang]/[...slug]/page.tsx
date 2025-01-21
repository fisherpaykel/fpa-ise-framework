import {sectionRenderer} from "@/app/[countryCode]/[lang]/utils/section-renderer";
import PageNotFound from "../components/PageNotFound";
import {Metadata} from "next";
import {getPageBySlug} from "@/app/[countryCode]/[lang]/utils/get-page-by-slug";
import {FALLBACK_SEO} from "@/app/[countryCode]/[lang]/utils/constants";

type Props = {
    params: {
        lang: string,
        slug: string,
        countryCode: string
    }
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const page = await getPageBySlug(params.countryCode, params.slug, params.lang);

    if (!page.data) return FALLBACK_SEO;
    const metadata = page.data[0]?.attributes.seo

    return {
        title: metadata?.metaTitle,
        description: metadata?.metaDescription
    }
}


export default async function PageRoute({params}: Props) {
    
    const page = await getPageBySlug(params.countryCode, params.slug, params.lang);
   
    if (page.data.length === 0) return <PageNotFound/>;
    const renderPage = page.data.find((page : any) => page.attributes.slug === params.slug[params.slug.length - 1]);
    if(!renderPage) return <PageNotFound/>;
    const contentSections = renderPage.attributes.blocks;
    return contentSections.map((section: any, index: number) => sectionRenderer(section, index, renderPage.attributes.type, renderPage.attributes.title, renderPage.attributes.menuLinks, contentSections.length));
}
