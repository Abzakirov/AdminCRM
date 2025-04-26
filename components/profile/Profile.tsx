import { UserType } from "@/@types";
import ProfileForm from "@/shared/profileForm/ProfileForm";
import { Button } from "antd";
import { cookies } from "next/headers";
import React from "react";

const Profiles = async () => {
  const cookieStore = await cookies();
  const res = cookieStore.get("user");
  const user: UserType = JSON.parse(res?.value!);

  return (
    <div className="flex w-full justify-center p-6 bg-[#f9f9f9] dark:bg-black min-h-screen">
      <div className="w-full  bg-white dark:bg-black rounded-lg shadow-md p-8 flex flex-col gap-6">
        <img
          src="/profile_img.svg"
          alt={user.first_name}
          className="w-full rounded-t-lg dark:hidden"
        />

        <div className="flex items-center justify-between ml-2">
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] bg-black rounded-full text-white text-[18px] text-center dark:bg-white dark:text-black flex items-center justify-center">
              {user?.image === "" ? (
                user.first_name.slice(0, 1)
              ) : (
                <img
                  src={user?.image}
                  alt={user.first_name}
                  className="rounded-full object-cover w-full h-full"
                />
              )}
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-medium">{user.first_name}</h2>
                <h2 className="text-[18px] font-medium">{user.last_name}</h2>
              </div>
              <p className="text-[15px] opacity-[0.5]">{user.email}</p>
            </div>
          </div>
          <Button type="primary">Edit Profile</Button>
        </div>

        <div>
          <ProfileForm />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-[18px] font-medium">My email Address:</h2>
          <div className="flex items-center gap-2">
            <div className="relative w-12 h-12">
              <img src="./circle.svg" alt="" className="w-full h-full" />
              <img
                src="/sms.svg"
                alt=""
                className="absolute inset-0 m-auto w-8 h-18"
              />
            </div>
            <div>
              <p className="text-[17px] opacity-[0.5]">{user.email}</p>
              <div className="flex items-center gap-2">
                <h2>Create Date:</h2>
                <p className="text-[14px] opacity-[0.9]">{user.createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
