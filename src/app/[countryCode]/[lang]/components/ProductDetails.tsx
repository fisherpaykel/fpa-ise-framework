"use client";
import { useRouter } from 'next/navigation';
import { useNavbarConfig } from '../utils/useNavbarConfig';
import { useEffect, useState } from 'react';
import { ProductTile } from "@fpapackages/fpa-card";
import { useFooterConfig } from '../utils/useFooterConfig';
import { useSelectedProduct } from '../utils/useProductConfig';

const ProductDetails = (data: any) => {
  const router = useRouter();
  const {updateConfig} = useNavbarConfig();
  useEffect(()=> {
    updateConfig({title: data.data.title, hideTitle: false, hideHeader: false})
  },[])

  const {updateFooterConfig} = useFooterConfig();

  useEffect(()=> {
    updateFooterConfig({isMainMenu: false, menuLinks: data.menuLinks.data})
  },[])

  const pageInfo = {
    goToNextPage: (categoryId: string) => {
      // router.push(`/${data.title}/${categoryId}`);
    },
  }

  // Listening to all changes, fires synchronously on every change
  const {selecteProduct} = useSelectedProduct();

  return (
    <section className="max-w-lg  mx-auto rounded-xl overflow-hidden md:max-w-4xl">
      <div className="md:flex justify-center">
        <ProductTile {...selecteProduct} goToPage={pageInfo.goToNextPage}/>
      </div>
    </section>
  );
};

export default ProductDetails;