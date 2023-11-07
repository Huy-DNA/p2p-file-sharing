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
          path: "/i",
          name: MENU_BAR.getFile,
          element: <GetFilePage />,
        },
        {
          type: "item",
          path: "/i",
          name: MENU_BAR.sharedFile,
          element: <SharedFilePage />,
        },
      ]}
    />
  );
}

export default App;
