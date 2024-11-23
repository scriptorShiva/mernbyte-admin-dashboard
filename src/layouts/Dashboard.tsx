import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";

const Dashboard = () => {
  // protection
  const { user } = useAuthStore();
  if (user === null) {
    return <Navigate to="/auth/login" replace={true} />;
  }
  return (
    <div>
      <h1>I am Dasboard Page</h1>
      <Outlet />
    </div>
  );
};

export default Dashboard;
