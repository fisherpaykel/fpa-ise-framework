"use client";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname} from "next/navigation";
import { Dialog } from '@headlessui/react'
import { useEffect, useRef, useState } from "react";
import { Header } from "@fpapackages/fpa-header";
import { useRouter } from "next/navigation"
import { useNavbarConfig } from '../utils/useNavbarConfig'
// import { useProductsQuery } from "../hooks/useProductsQuery";
interface NavLink {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
}

function NavLink({ attributes }: any) {

  const path = usePathname();

  return (
    <li className="flex">
      <Link
        href={attributes.url}
        className={`flex items-center mx-4 -mb-1 border-b-2 dark:border-transparent ${
          path === attributes.url && "dark:text-violet-400 dark:border-violet-400"
        }}`}
      >
        {attributes.text}
      </Link>
    </li>
  );
}


export default function Navbar({
  links,
  logoUrl,
  logoText,
  title,
  hideTitle,
  hideHeader
}: {
  links: Array<NavLink>;
  logoUrl: string | null;
  logoText: string | null;
  title: string;
  hideTitle: boolean;
  hideHeader: boolean
}) {
  const router = useRouter();
  const currentPage = usePathname().split('/');
  const shouldLog = useRef(true);
  let categoryName = 'refrigeration';
  // if(currentPage.length> 3) {
  //   categoryName = currentPage[3].toLocaleLowerCase();
  // }

  // const {getProducts} = useProductsQuery();
  // useEffect(() => {
  //   if (shouldLog.current) {
  //     shouldLog.current = false;
  //     console.log('logged');
  //     getProducts(categoryName);
  //   }
  // }, [categoryName]);

// Listening to all changes, fires synchronously on every change
const {title: navbarTitle, hideTitle: hideNavbarTitle, hideHeader: hideNavbar} = useNavbarConfig();

  const goBack = (data: any) => {
    router.back();
  }

  return (
    <>
       <Header goBack={goBack} title={navbarTitle} hideTitle={hideNavbarTitle} hideHeader={hideNavbar}/>
    </>
  );
}
