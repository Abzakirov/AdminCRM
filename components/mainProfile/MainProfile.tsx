"use client";

import { useState, useEffect } from "react";
import { Button } from "antd";
import EditProfileDrawer from "@/shared/editProfileDrawer/EditProfileDrawer";
import ProfileForm from "@/shared/profileForm/ProfileForm";
import Cookies from "js-cookie";
import { Camera } from "lucide-react";
import { useEditProfileImgMutation } from "@/hooks/mutation";
import { UserType } from "@/@types";
import EditPassword from "@/shared/mod/EditPassword";

const MainProfile = ({ user }: { user: UserType }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false); 
  const [currentUser, setCurrentUser] = useState<UserType>(user);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    user.image ||
      "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
  );

  const { mutate, isPending } = useEditProfileImgMutation();

  useEffect(() => {
    const savedProfile = Cookies.get("user");
    if (savedProfile) {
      try {
        const profileData = JSON.parse(savedProfile);
        setCurrentUser(profileData);
        setImagePreview(profileData.image);
      } catch (error) {
        console.error("Failed to parse user from cookies:", error);
      }
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = () => {
    if (!selectedImage) return;

    const profileData = {
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      email: currentUser.email,
      role: currentUser.role,
    };

    mutate({
      profileData,
      image: selectedImage,
    });
  };

  const showDrawer = () => setDrawerVisible(true);
  const onCloseDrawer = () => setDrawerVisible(false);

  const showPasswordModal = () => setPasswordModalVisible(true);
  const closePasswordModal = () => setPasswordModalVisible(false);

  const handleSaveUser = (updatedUser: UserType) => {
    setCurrentUser(updatedUser);
    setImagePreview(updatedUser.image || imagePreview);
    Cookies.set("user", JSON.stringify(updatedUser));
  };

  return (
    <div className="flex w-full justify-center p-4 sm:p-6 bg-[#f9f9f9] dark:bg-gray-900 min-h-screen dark:shadow-[#1f1f1f]">
      <div
        className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-4 sm:p-8 flex flex-col gap-4 sm:gap-6 border border-gray-100 dark:border-none"
        style={{
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <img
          src="/profile_img.svg"
          alt={currentUser.first_name}
          className="w-full rounded-t-lg h-[70px]"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 sm:ml-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] bg-blue-500 rounded-full font-medium text-white text-[16px] sm:text-[18px] text-center dark:bg-white dark:text-black flex items-center justify-center overflow-hidden shadow-md">
                {currentUser?.image === "" ? (
                  currentUser.first_name.slice(0, 1)
                ) : (
                  <img
                    src={imagePreview}
                    alt={currentUser.first_name}
                    className="rounded-full object-cover w-full h-full"
                  />
                )}
              </div>
              <label className="absolute bottom-0 right-0 cursor-pointer bg-white rounded-full p-[2px] shadow-lg">
                <Camera size={16} className="dark:text-black" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </label>
            </div>

            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1 sm:gap-2">
                <h2 className="text-[16px] sm:text-[18px] font-medium">
                  {currentUser.first_name}
                </h2>
                <h2 className="text-[16px] sm:text-[18px] font-medium">
                  {currentUser.last_name}
                </h2>
              </div>
              <p className="text-[13px] sm:text-[15px] opacity-[0.5]">{currentUser.email}</p>
            </div>
          </div>
          <div className="flex  sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <Button
              type="primary"
              onClick={showDrawer}
              className="shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              Edit Profile
            </Button>
            <Button
              type="primary"
              onClick={showPasswordModal}
              className="shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              Edit Password
            </Button>
          </div>
        </div>

        {selectedImage && (
          <Button
            type="default"
            onClick={handleImageUpload}
            loading={isPending}
            className="w-full sm:w-[160px] ml-0 sm:ml-2 shadow-md hover:shadow-lg"
          >
            Upload Image
          </Button>
        )}

        <div>
          <ProfileForm user={currentUser} />
        </div>

        <div className="p-2 sm:p-4">
          <h2 className="text-[16px] sm:text-[18px] font-medium">My email Address:</h2>
          <p className="text-[15px] sm:text-[17px] opacity-[0.5]">{currentUser.email}</p>
        </div>
      </div>

      <EditProfileDrawer
        visible={drawerVisible}
        onClose={onCloseDrawer}
        user={currentUser}
        onSave={handleSaveUser}
      />

      <EditPassword
        visible={passwordModalVisible}
        onClose={closePasswordModal}
        user={currentUser}
      />
    </div>
  );
};

export default MainProfile;