type MenuBarStore = {
  selectedMenu: string;
  isCategoryItem: boolean;
  setSelectedMenu: (selectedMenu: string) => void;
  setIsCategoryItem: (payload: boolean) => void;
};
