import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login/login";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [{ path: "", element: <Home /> }],
  },
  {
    path: "/auth",
    element: <NonAuth />,
    children: [{ path: "login", element: <Login /> }],
  },
]);
