import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";

const NonAuth = () => {
  // use location for getting route
  const location = useLocation();

  //protection
  const { user } = useAuthStore();
  if (user !== null) {
    console.log(location, "search");
    const returnTo =
      new URLSearchParams(location.search).get("returnTo") || "/";

    return <Navigate to={returnTo} replace={true} />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default NonAuth;
