import { create } from 'zustand'
 
interface NavbarProps {
  title: string;
  hideTitle: boolean;
  hideHeader: boolean;
}

interface UpdateConfig extends NavbarProps {
    updateConfig: (config: NavbarProps) => void
}

export const useNavbarConfig = create<UpdateConfig>((set) => ({
  title: '',
  hideTitle: false,
  hideHeader: false,
  updateConfig: (config: NavbarProps) => set((state: NavbarProps) => ({ title: config.title, hideTitle: config.hideTitle, hideHeader: config.hideHeader}))
}))