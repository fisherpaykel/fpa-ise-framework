import {fetchAPI} from "@/app/[countryCode]/[lang]/utils/fetch-api";

export async function getPageBySlug(countryCode:string, slug: string, lang: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

    const path = `/app/${countryCode}/${lang}/${slug}`;

    return await fetchAPI(path, {}, {});
}