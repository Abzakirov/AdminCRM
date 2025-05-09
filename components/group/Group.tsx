import React from "react";
import GroupClient from "../groupClient/GroupClient";
import GroupHeader from "./header/Header";

const GroupComponent = () => {
  return (
    <div>
      <GroupHeader />
      <GroupClient />
    </div>
  );
};

export default GroupComponent;
