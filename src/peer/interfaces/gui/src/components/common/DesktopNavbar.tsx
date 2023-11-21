import { Link } from "react-router-dom";
import { List, ListItem, Typography } from "@material-tailwind/react";
import { useMenuBarStore } from "@states/common";

export const DesktopNavbar: Component<{ menu: RouteMenu }> = ({ menu }) => {
  const { selectedMenu, setSelectedMenu, setIsCategoryItem } =
    useMenuBarStore();

  return (
    <div className="flex items-center gap-4">
      <Typography variant="h6"> P2P file sharing</Typography>
      <List className="p-0 flex flex-row gap-0">
        {menu.map((menuItem, idx) => {
          if (menuItem === "divider") return;
          if (menuItem.type === "item") {
            return (
              <Link key={idx} to={menuItem.path}>
                <ListItem
                  className={
                    "rounded-none m-0 py-1 hover:bg-white/40 hover:text-black " +
                    (selectedMenu === menuItem.name
                      ? "bg-white text-black"
                      : "text-white")
                  }
                  onClick={() => {
                    setSelectedMenu(menuItem.name);
                    setIsCategoryItem(false);
                  }}
                >
                  {menuItem.name}
                </ListItem>
              </Link>
            );
          }
        })}
      </List>
    </div>
  );
};
