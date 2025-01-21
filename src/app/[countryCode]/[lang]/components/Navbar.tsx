"use client";
import Link from "next/link";
import { usePathname} from "next/navigation";
import { Header } from "@fpapackages/fpa-header";
import { useRouter } from "next/navigation"
import { useNavbarConfig } from '../utils/useNavbarConfig'

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
