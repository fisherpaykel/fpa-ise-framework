"use client";
import { useRouter } from 'next/navigation';
import { useNavbarConfig } from '../utils/useNavbarConfig';
import { useEffect} from 'react';
import { ProductTile, ProductTileProps} from "@fpapackages/fpa-card";
import { useFooterConfig } from '../utils/useFooterConfig';
import { MenuLink } from './Footer';

const YourWishlist = (data: any) => {
  const router = useRouter();
  const {updateConfig} = useNavbarConfig();
  useEffect(()=> {
    updateConfig({title: data.data.title, hideTitle: false, hideHeader: false})
  },[])

  const {updateFooterConfig} = useFooterConfig();

  useEffect(()=> {
    data.menuLinks.data.forEach((item: MenuLink)=> {
      if (item.attributes.links === data.data.slug) {
        item.attributes.isActive = true;
      } else {
        item.attributes.isActive = false;
      }
    });
    updateFooterConfig({isMainMenu: true, menuLinks: data.menuLinks.data})
  },[])

  const pageInfo = {
    goToNextPage: (productId: string) => {
    }
}

  return (
    <section className="max-w-md mx-auto rounded-xl overflow-hidden md:max-w-2xl">
    <div className="md:flex justify-center">
    <ProductTile {...data.data} goToPage={pageInfo.goToNextPage}></ProductTile>
  </div>
  </section>
  );
};

export default YourWishlist;