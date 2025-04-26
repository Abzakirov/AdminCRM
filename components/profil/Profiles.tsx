import React from "react";
import { cookies } from "next/headers";
import { UserType } from "@/@types";

const Profeles = async () => {
  const cookieStore = await cookies();
  const res = cookieStore.get("user");
  const user: UserType = JSON.parse(res?.value!);

  return (
    <div className="flex items-center gap-2">
      <div className="!text-[14px]">
        <div className="flex items-center gap-2">
          <h2>{user?.first_name}</h2>
          <h2>{user?.last_name}</h2>
        </div>
        <div className="flex items-center gap-1 justify-end">
          <div className="bg-[green] w-[10px] h-[10px] rounded-full"></div>
          <h2 className="capitalize text-end">{user?.role}</h2>
        </div>
      </div>
      <div className="w-[40px] h-[40px] bg-black rounded-full text-white text-[18px] text-center dark:bg-white dark:text-black flex items-center justify-center">
        {user?.image === "" ? user.first_name.slice(0, 1) : <img src={user?.image} alt={user.first_name}/>}
      </div>
    </div>
  );
};

export default Profeles;
