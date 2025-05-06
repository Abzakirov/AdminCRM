'use client';

export type EditProfileType = {
  first_name: string;
  last_name: string;
  email: string;
};

import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, ConfigProvider, theme } from "antd";
import { UserType } from "@/@types"; 
import { useEditProfileMutation } from "@/hooks/mutation";
import Cookies from "js-cookie";
import { useTheme } from "next-themes";

interface EditProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
  user: UserType;
  onSave: (updatedUser: UserType) => void;
}

const EditProfileDrawer: React.FC<EditProfileDrawerProps> = ({ visible, onClose, user, onSave }) => {
  const [formData, setFormData] = useState<EditProfileType>({
    first_name: "",
    last_name: "",
    email: "",
  });

  const { theme: currentTheme } = useTheme();
  const { mutate, isPending } = useEditProfileMutation();

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!user) return;

    const updatedUser: EditProfileType = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
    };

    mutate(updatedUser, {
      onSuccess: () => {
        const newUser = { ...user, ...updatedUser };
        Cookies.set("user", JSON.stringify(newUser));
        onSave(newUser);
        onClose();
      },
    });
  };

  // Стили для dark темы
  const darkThemeStyles = {
    drawer: {
      body: {
        backgroundColor: "#111827",
        color: "#F3F4F6",
      },
      header: {
        backgroundColor: "#111827",
        borderBottom: "1px solid #1F2937",
        color: "#FFFFFF",
      },
      content: {
        backgroundColor: "#111827",
      }
    },
    input: {
      backgroundColor: "#1F2937",
      color: "#F3F4F6",
      borderColor: "#374151",
    },
    label: {
      color: "#D1D5DB",
    },
    cancelButton: {
      backgroundColor: "#1F2937",
      color: "#F3F4F6",
      borderColor: "#374151",
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Drawer
        title="Edit Profile"
        placement="right"
        onClose={onClose}
        open={visible}
        width={450}
        styles={currentTheme === 'dark' ? darkThemeStyles.drawer : {}}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className={`block mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : ''}`}>
              First Name:
            </label>
            <Input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={currentTheme === 'dark' ? 'dark-theme-input' : ''}
              style={currentTheme === 'dark' ? darkThemeStyles.input : {}}
            />
          </div>
          <div>
            <label className={`block mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : ''}`}>
              Last Name:
            </label>
            <Input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={currentTheme === 'dark' ? 'dark-theme-input' : ''}
              style={currentTheme === 'dark' ? darkThemeStyles.input : {}}
            />
          </div>
          <div>
            <label className={`block mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : ''}`}>
              Email:
            </label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={currentTheme === 'dark' ? 'dark-theme-input' : ''}
              style={currentTheme === 'dark' ? darkThemeStyles.input : {}}
            />
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <Button 
              onClick={onClose}
              style={currentTheme === 'dark' ? darkThemeStyles.cancelButton : {}}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              onClick={handleSave} 
              loading={isPending}
            >
              Save
            </Button>
          </div>
        </div>
      </Drawer>
    </ConfigProvider>
  );
};

export default EditProfileDrawer;