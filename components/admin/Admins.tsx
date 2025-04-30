import { axiosInstance } from "@/hooks/useAxios/useAxios";
import AdminHeader from "../adminHeader/AdminHeader";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import AdminTableClient from "../tables";

const getAdmins = async () => {
  const res = await axiosInstance.get("/staff/all-admins");
  return res.data.data;
};

const AdminComponent = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admins"],
    queryFn: getAdmins,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="mt-3">
      <HydrationBoundary state={dehydratedState}>
        <AdminHeader />
        <AdminTableClient />
      </HydrationBoundary>
    </div>
  );
};

export default AdminComponent;
