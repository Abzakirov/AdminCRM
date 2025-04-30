"use client";

import React from "react";
import AdminTable from "@/shared/table/AdminTable";
import AdminTableLight from "@/shared/table/AdminLightTable";
import { useTheme } from "next-themes";

const AdminTableClient = () => {
  const { theme } = useTheme();

  return (
    <div>
      {theme === "dark" ? <AdminTable /> : <AdminTableLight />}
    </div>
  );
};

export default AdminTableClient;