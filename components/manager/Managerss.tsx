import { axiosInstance } from "@/hooks/useAxios/useAxios";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import ManagerClient from "./managerclient";
import ManagerHeader from "./header/Header";

const getManagers = async () => {
  const res = await axiosInstance.get("/staff/all-managers");
  return res.data.data;
};

const Managerss = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["managers"],
    queryFn: getManagers,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div>
      <HydrationBoundary state={dehydratedState}>
        <ManagerHeader />
        <ManagerClient />
      </HydrationBoundary>
    </div>
  );
};

export default Managerss;
