"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useNavbarConfig } from '../utils/useNavbarConfig';
import { useEffect, useState } from 'react';
import { ProductList } from "@fpapackages/fpa-product-list";
import { useFooterConfig } from '../utils/useFooterConfig';

const Categories = (data: any) => {
  const router = useRouter();
  const {updateConfig} = useNavbarConfig();
  const currentPage = usePathname();
  useEffect(()=> {
    updateConfig({title: data.title, hideTitle: false, hideHeader: false})
  },[])

  const {updateFooterConfig} = useFooterConfig();

  useEffect(()=> {
    updateFooterConfig({isMainMenu: false, menuLinks: data.menuLinks.data})
  },[])

  const pageInfo = {
    goToNextPage: (category: string) => {
      router.push(`${currentPage}/${category}`);
    },
  }
  return (
    <>
      <ProductList {...data} goToNextPage={pageInfo.goToNextPage}></ProductList>
    </>
  );
};

export default Categories;