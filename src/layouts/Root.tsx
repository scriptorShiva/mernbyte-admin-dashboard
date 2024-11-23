import { useEffect } from "react";
import { useQuery } from "react-query";
import { Outlet } from "react-router";
import { self } from "../http/api";
import { useAuthStore } from "../store";

const getSelf = async () => {
  const { data } = await self();
  return data;
};

function Root() {
  const { setUser } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    // we dont need enabled as we want this query to run only once automatically
    // enabled: false,
  });

  useEffect(() => {
    console.log(data);
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <Outlet />;
}

export default Root;
