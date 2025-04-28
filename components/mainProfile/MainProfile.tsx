'use client';

import React, { useState, useEffect } from "react";
import { Button } from "antd";
import EditProfileDrawer from "@/shared/editProfileDrawer/EditProfileDrawer";
import { UserType } from "@/@types";
import ProfileForm from "@/shared/profileForm/ProfileForm";
import Cookies from "js-cookie"; // << сюда тоже

const MainProfile = ({ user }: { user: UserType }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType>(user);

  useEffect(() => {
    const userFromCookie = Cookies.get("user");
    if (userFromCookie) {
      try {
        const parsedUser = JSON.parse(userFromCookie);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user from cookies:", error);
      }
    }
  }, []);

  const showDrawer = () => setDrawerVisible(true);
  const onCloseDrawer = () => setDrawerVisible(false);

  const handleSaveUser = (updatedUser: UserType) => {
    setCurrentUser(updatedUser);  
  };

  return (
    <div className="flex w-full justify-center p-6 bg-[#f9f9f9] dark:bg-black min-h-screen">
      <div className="w-full bg-white dark:bg-black rounded-lg shadow-md p-8 flex flex-col gap-6">
        <img
          src="/profile_img.svg"
          alt={currentUser.first_name}
          className="w-full rounded-t-lg dark:hidden"
        />
        <div className="flex items-center justify-between ml-2">
          <div className="flex items-center gap-3">
            <div className="w-[50px] h-[50px] bg-blue-500 rounded-full font-medium text-white text-[18px] text-center dark:bg-white dark:text-black flex items-center justify-center">
              {currentUser?.image === "" ? (
                currentUser.first_name.slice(0, 1)
              ) : (
                <img
                  src={currentUser?.image}
                  alt={currentUser.first_name}
                  className="rounded-full object-cover w-full h-full"
                />
              )}
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-medium">{currentUser.first_name}</h2>
                <h2 className="text-[18px] font-medium">{currentUser.last_name}</h2>
              </div>
              <p className="text-[15px] opacity-[0.5]">{currentUser.email}</p>
            </div>
          </div>
          <Button type="primary" onClick={showDrawer}>
            Edit Profile
          </Button>
        </div>
        <div>
          <ProfileForm user={currentUser} />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-[18px] font-medium">My email Address:</h2>
          <p className="text-[17px] opacity-[0.5]">{currentUser.email}</p>
        </div>
      </div>

      <EditProfileDrawer
        visible={drawerVisible}
        onClose={onCloseDrawer}
        user={currentUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default MainProfile;
