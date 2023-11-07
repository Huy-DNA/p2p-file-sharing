import {DesktopNavbar } from "@components/common";

export const AppNavigation: Component<{ menu: RouteMenu }> = ({ menu }) => {

  return (
    <div className="w-full max-h-[768px] px-3 z-10 bg-gray-900">
      <div className="flex items-center justify-between h-full">
        <DesktopNavbar menu={menu} />
      </div>
    </div>
  );
};
