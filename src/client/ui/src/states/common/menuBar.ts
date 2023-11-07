import { create } from "zustand";
import { MENU_BAR } from "@constants";

export const useMenuBarStore = create<MenuBarStore>()((set) => ({
  selectedMenu: MENU_BAR.home,
  isCategoryItem: false,
  setSelectedMenu: (selectedMenu) => {
    set({ selectedMenu: selectedMenu });
  },
  setIsCategoryItem: (payload) => {
    set({ isCategoryItem: payload });
  }
}));
