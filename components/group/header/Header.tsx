'use client';

import OpenGroupButton from "@/components/openDrawerButton/OpenGroupButton ";
import CreateGroup from "@/shared/createGroup/CreateGroup";
import '@ant-design/v5-patch-for-react-19';
import { Input } from "antd";
import { useState } from "react";

const GroupHeader: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const showDrawer = (): void => {
    setDrawerVisible(true);
  };

  const closeDrawer = (): void => {
    setDrawerVisible(false);
  };

  return (
    <div className="flex items-center justify-between p-3 max-[600px]:gap-4 max-[600px]:!flex-wrap max-[600px]:justify-center">
      <div>
        <h2 className="text-[18px] font-medium">Gruhlar royhati</h2>
      </div>
      <div className="flex items-center gap-3 !max-[600px]:!flex-wrap max-[600px]:justify-center">
        <Input
          type="text"
          placeholder="Search Administrative authorities"
          className="!w-[270px] max-[600px]:!w-full "
        />
        <OpenGroupButton showDrawer={showDrawer} />
        <CreateGroup visible={drawerVisible} onClose={closeDrawer} />
      </div>
    </div>
  );
};

export default GroupHeader;
