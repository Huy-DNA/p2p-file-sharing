import { useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { AppNavigation } from "@components/common";

export const AppLayout: Component<{ menu: RouteMenu }> = ({ menu }) => {
  const routeItems = useMemo(() => {
    const items: { path: string; element: React.ReactElement }[] = [];

    for (const menuItem of menu) {
      if (menuItem === "divider" || menuItem.type === "logout-btn") continue;
      items.push({ path: menuItem.path, element: menuItem.element });
    }

    return items;
  }, [menu]);

  return (
    <div className="flex flex-col h-screen sm:min-h-screen text-white">
      <AppNavigation menu={menu} />
      <div className="flex-1 px-4 py-8 h-screen overflow-auto bg-black">
        <Routes>
          {routeItems.map((item) => (
            <Route path={item.path} element={item.element} key={item.path} />
          ))}
        </Routes>
      </div>
    </div>
  );
};
