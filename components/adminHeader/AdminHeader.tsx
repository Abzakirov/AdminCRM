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
    <div className="flex items-center justify-between p-3 max-[600px]:gap-4 max-[600px]:flex-wrap max-[600px]:justify-center">
      <div>
        <h2 className="text-[18px] font-medium">Adminlar royxati:</h2>
      </div>
      <div className="flex items-center gap-3 ">
        <Input type="text" placeholder="Search Administrative authorities" className="!w-[270px] max-[500px]:!w-full" />
        <OpenDrawerButton showDrawer={showDrawer} />
        <AddAdminDrawer visible={drawerVisible} onClose={closeDrawer} />
      </div>
    </div>
  );
};

export default AdminHeader;
