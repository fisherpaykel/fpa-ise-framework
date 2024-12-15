import useComponentsMapping from "../hooks/useComponentsMapping";
import {MenuLink} from "../components/Footer";
import { ProductProperties} from './useProductConfig';

export interface FooterMenuLinks {
    data: MenuLink[];
}
export function sectionRenderer(section: any, index: number, type: string, title: string, menuLinks: FooterMenuLinks, sectionLength?: number, products?: ProductProperties[]) {
  const [handleMapComponent] = useComponentsMapping();

  return handleMapComponent(index, section, type, title, menuLinks, sectionLength);
}
