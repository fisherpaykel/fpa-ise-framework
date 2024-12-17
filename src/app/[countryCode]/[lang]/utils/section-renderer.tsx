import useComponentsMapping from "../hooks/useComponentsMapping";
import {MenuLink} from "../components/Footer";

export interface FooterMenuLinks {
    data: MenuLink[];
}
export function sectionRenderer(section: any, index: number, type: string, title: string, menuLinks: FooterMenuLinks, sectionLength?: number) {
  const [handleMapComponent] = useComponentsMapping();

  return handleMapComponent(index, section, type, title, menuLinks, sectionLength);
}
