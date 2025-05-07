"use client";

import React from "react";
import { useTheme } from "next-themes";
import StudentDarkTable from "@/shared/table/StudentDarkTable";
import StudentLightTable from "@/shared/table/StudentLightTable";

const StudentClient = () => {
  const { theme } = useTheme();

  return (
    <div>
      {theme === "dark" ? <StudentDarkTable /> : <StudentLightTable />}
    </div>
  );
};

export default StudentClient;