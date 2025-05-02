import { axiosInstance } from "@/hooks/useAxios/useAxios";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import TeacherHeader from "./header/Header";
import ClientTable from "./ClientTable";

const getTeachers = async () => {
  const res = await axiosInstance.get("/teacher/get-all-teachers");
  console.log("Data from backend:", res.data.data);
  return res.data.data;
};

const TeachersComponent = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="mt-3">
      <HydrationBoundary state={dehydratedState}>
        <TeacherHeader />
       <div className="p-3">
       <ClientTable />
       </div>
      </HydrationBoundary>
    </div>
  );
};

export default TeachersComponent;
