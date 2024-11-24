import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login/login";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import Users from "./pages/users/user";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        children: [
          { path: "", element: <Home /> },
          { path: "/users", element: <Users /> },
        ],
      },
      {
        path: "/auth",
        element: <NonAuth />,
        children: [{ path: "login", element: <Login /> }],
      },
    ],
  },
]);
