import { MENU_BAR } from "@constants";
import { AppLayout } from "./layouts/AppLayout";
import { GetFilePage, HomePage, SharedFilePage } from "@pages";

function App() {
  return (
    <AppLayout
      menu={[
        {
          type: "item",
          path: "/",
          name: MENU_BAR.home,
          element: <HomePage />,
        },
        {
          type: "item",
          path: "/fetch",
          name: MENU_BAR.fetch,
          element: <GetFilePage />,
        },
        {
          type: "item",
          path: "/shared",
          name: MENU_BAR.publish,
          element: <SharedFilePage />,
        },
        {
          type: "item",
          path: "/discover",
          name: MENU_BAR.discover,
          element: <SharedFilePage />,
        },
      ]}
    />
  );
}

export default App;
