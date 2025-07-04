import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { self } from "../http/api";
import { useAuthStore } from "../store";
import { AxiosError } from "axios";

const getSelf = async () => {
  const { data } = await self();
  return data;
};

function AuthLoader() {
  const { setUser } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    // we dont need enabled as we want this query to run only once automatically
    // enabled: false,
    retry: (failureCount: number, error) => {
      if (error instanceof AxiosError && error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
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

export default AuthLoader;
