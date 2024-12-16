import Home from "../components/Home";
import { FooterMenuLinks } from "../utils/section-renderer";
interface ComponentDataProps {
  name: string;
  component: React.ReactNode;
}

enum ComponentName {
  HOME = "component.home-component",
}

export const useComponentsMapping = () => {
  const handleMapComponent = (
    index: number,
    section: any,
    type: string,
    title: string,
    menuLinks: FooterMenuLinks,
    sectionLength?: number
  ) => {
    const cList: ComponentDataProps[] = [
      {
        name: ComponentName.HOME,
        component: (
          <Home
            key={index}
            data={section}
            menuLinks={menuLinks}
            sectionLength={sectionLength ? sectionLength : 5}
          />
        ),
      }
    ];

    const renderComponent = cList.find(
      (obj: ComponentDataProps) => obj.name === section.__component
    );

    return renderComponent?.component;
  };

  return [handleMapComponent];
};

export default useComponentsMapping;
