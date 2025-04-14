import { create } from 'zustand'

interface MenuState {
  isHeaderMenuOpen: boolean
  setHeaderMenuOpen: (isOpen: boolean) => void
}

export const useMenuStore = create<MenuState>((set) => ({
  isHeaderMenuOpen: false,
  setHeaderMenuOpen: (isOpen) => set({ isHeaderMenuOpen: isOpen })
}))