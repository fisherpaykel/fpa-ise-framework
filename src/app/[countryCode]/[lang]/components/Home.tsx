"use client";
import { ProductThumb } from "@fpapackages/fpa-product-thumb";
import { usePathname, useRouter } from 'next/navigation'
import { useNavbarConfig } from '../utils/useNavbarConfig';
import { useEffect } from "react";
import { useFooterConfig } from '../utils/useFooterConfig';
import { FooterMenuLinks } from '../utils/section-renderer';

interface HomeProps {
  data: {
    productName: string;
    productImageSrc: string;
    slug: string;
  };
  menuLinks: FooterMenuLinks;
  sectionLength: number
}

const Home = ({data, menuLinks, sectionLength}: HomeProps) => {
  const router = useRouter();
  const currentPage = usePathname();

  const productThumbProps = {
    totalItems: sectionLength + 1,
    goToPage: (slug: string) => {
      router.push(`${currentPage}/${slug}`)
    },
  }
  const {updateConfig} = useNavbarConfig();
  useEffect(()=> {
    updateConfig({title: '', hideTitle: true, hideHeader: false})
  },[])

  const {updateFooterConfig} = useFooterConfig();

  useEffect(()=> {
    updateFooterConfig({isMainMenu: true, menuLinks: menuLinks.data})
  },[])

  return (
    <>
      <ProductThumb {...productThumbProps} slug={data.slug} productName={data.productName} productImageSrc={data.productImageSrc}/>
    </>
  );
}

export default Home;
