import LangRedirect from './components/LangRedirect';
import {sectionRenderer} from './utils/section-renderer';
import {getPageBySlug} from "@/app/[countryCode]/[lang]/utils/get-page-by-slug";

export default async function RootRoute({params}: { params: { lang: string, countryCode: string } }) {
    const page = await getPageBySlug(params.countryCode, 'home', params.lang);
    if (page.data.length == 0 && params.lang !== "en") return <LangRedirect/>
    if (page.data.length === 0) return null;
    const contentSections = page.data[0].attributes.blocks;
    contentSections.map((section: any, index: number) => sectionRenderer(section, index, page.data[0].attributes.type, page.data[0].attributes.title, page.data[0].attributes.menuLinks));
}
