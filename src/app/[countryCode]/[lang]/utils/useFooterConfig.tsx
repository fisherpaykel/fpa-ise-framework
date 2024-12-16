import { create } from 'zustand'

interface Section {
  attributes: {
    title: string
    links: string
    type: string
    isActive: boolean
  }
}
interface FooterProps {
  isMainMenu: boolean
  menuLinks: Section[]
}

interface UpdateFooterConfig extends FooterProps {
    updateFooterConfig: (config: FooterProps) => void
}

export const useFooterConfig = create<UpdateFooterConfig>((set) => ({
  isMainMenu: true,
  menuLinks: [],
  updateFooterConfig: (config: FooterProps) => set((state: FooterProps) => ({ isMainMenu: config.isMainMenu, menuLinks: config.menuLinks}))
}))