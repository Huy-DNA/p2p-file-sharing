type RouteItem = {
  name: string;
  type: "item";
  path: string;
  element: React.ReactElement;
};

type LogoutBtn = {
  name: string;
  type: "logout-btn";
  onClick: () => void;
};

type RouteSkeleton = {
  name: string;
  type: "skeleton";
  path: string;
  element: React.ReactElement;
};

type RouteMenuItem = RouteItem | RouteSkeleton | LogoutBtn | "divider";

type RouteMenu = RouteMenuItem[];
