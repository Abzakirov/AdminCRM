'use client'

import AddAdminDrawer from "@/shared/addAdminDrawer/AddAdminDrawer";
import { Input } from "antd";
import { useState } from "react";
import OpenDrawerButton from "../openDrawerButton/OpenDrawerButton";

const AdminHeader: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const showDrawer = (): void => {
    setDrawerVisible(true);
  };

  const closeDrawer = (): void => {
    setDrawerVisible(false);
  };

  return (
    <div className="flex items-center justify-between p-3">
      <div>
        <h2 className="text-[18px] font-medium">Administrative authorities directory:</h2>
      </div>
      <div className="flex items-center gap-3">
        <Input type="text" placeholder="Search Administrative authorities" className="!w-[270px]" />
        <OpenDrawerButton showDrawer={showDrawer} />
        <AddAdminDrawer visible={drawerVisible} onClose={closeDrawer} />
      </div>
    </div>
  );
};

export default AdminHeader;
