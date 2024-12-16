"use client";
import { useRouter } from "next/navigation";
import { FpaFooter } from "@fpapackages/fpa-footer";
import { useFooterConfig } from '../utils/useFooterConfig';
import { useEffect } from "react";
export interface MenuLink {
  attributes: {
    title: string
    links: string
    type: string
    isActive: boolean
  }
}

export default function Footer({
  menuLinks,
  isMainMenu
}: {
  menuLinks: Array<MenuLink>;
  isMainMenu: boolean;
}) {
  const router = useRouter();
  const data = {
    goToPage: (page: string) => {
      router.push(page)
    },
  }

  const {updateFooterConfig} = useFooterConfig();
  useEffect(()=> {
    updateFooterConfig({isMainMenu: isMainMenu, menuLinks: menuLinks})
  },[])

  const {isMainMenu: footerMainMenu, menuLinks: footerMenuLinks} = useFooterConfig();

  return (
    <div className="fixed bottom-0 w-screen">
      <FpaFooter goToPage={data.goToPage} isMainMenu={footerMainMenu} menuLinks={footerMenuLinks}></FpaFooter>
    </div>
  );
}

