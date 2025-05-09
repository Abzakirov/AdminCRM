"use client";

import React from "react";
import { useTheme } from "next-themes";
import GroupDarkTable from "@/shared/table/GroupDarkTable";
import GroupLightTable from "@/shared/table/GroupLightTable";

const GroupClient = () => {
  const { theme } = useTheme();

  return (
    <div>
      {theme === "dark" ? <GroupDarkTable /> : <GroupLightTable />}
    </div>
  );
};

export default GroupClient;