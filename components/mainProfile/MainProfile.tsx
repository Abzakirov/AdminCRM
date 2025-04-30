"use client";

import { useState, useEffect } from "react";
import { Button } from "antd";
import EditProfileDrawer from "@/shared/editProfileDrawer/EditProfileDrawer";
import { UserType } from "@/@types";
import ProfileForm from "@/shared/profileForm/ProfileForm";
import Cookies from "js-cookie";
import { Camera } from "lucide-react";
import { useEditProfileImgMutation } from "@/hooks/mutation";

const MainProfile = ({ user }: { user: UserType }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
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

  const handleSaveUser = (updatedUser: UserType) => {
    setCurrentUser(updatedUser);
    setImagePreview(updatedUser.image || imagePreview);
    Cookies.set("user", JSON.stringify(updatedUser));
  };

  return (
    <div className="flex w-full justify-center p-6 bg-[#f9f9f9] dark:bg-black min-h-screen dark:shadow-[#1f1f1f]">
      <div className="w-full bg-white dark:bg-black rounded-lg shadow-xl p-8 flex flex-col gap-6 border border-gray-100 dark:border-gray-800" 
           style={{ 
             boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)", 
             transition: "all 0.3s ease-in-out" 
           }}>
        <img
          src="/profile_img.svg"
          alt={currentUser.first_name}
          className="w-full rounded-t-lg "
        />

        <div className="flex items-center justify-between ml-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-[50px] h-[50px] bg-blue-500 rounded-full font-medium text-white text-[18px] text-center dark:bg-white dark:text-black flex items-center justify-center overflow-hidden shadow-md">
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
                <Camera size={18} className="dark:text-black"/>
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
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-medium">{currentUser.first_name}</h2>
                <h2 className="text-[18px] font-medium">{currentUser.last_name}</h2>
              </div>
              <p className="text-[15px] opacity-[0.5]">{currentUser.email}</p>
            </div>
          </div>
          <Button type="primary" onClick={showDrawer} className="shadow-md hover:shadow-lg">
            Edit Profile
          </Button>
        </div>

        {selectedImage && (
          <Button
            type="default"
            onClick={handleImageUpload}
            loading={isPending}
            className="w-[160px] ml-2 shadow-md hover:shadow-lg"
          >
            Upload Image
          </Button>
        )}

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-inner">
          <ProfileForm user={currentUser} />
        </div>

        <div className="flex flex-col gap-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-md">
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