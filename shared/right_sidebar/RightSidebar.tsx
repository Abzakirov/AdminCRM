"use client";

import { useState, useEffect } from "react";
import { Drawer, Button, Spin } from "antd";
import { AdminUserType, EditAdminType } from "@/@types";
import { useEditAdminMutation } from "@/hooks/mutation";
import { showErrorToast } from "../toast/Toast";

interface RightSidebarProps {
  user?: AdminUserType | null;
  onClose: () => void;
}

const inputClasses = "p-2 rounded border bg-[#f7f7f7] dark:bg-gray-800 text-black dark:text-white";
const labelClasses = "mb-1 text-black dark:text-white";

const RightSidebar: React.FC<RightSidebarProps> = ({ user, onClose }) => {
  const { mutate, isPending } = useEditAdminMutation();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    status: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        status: user.status ?? "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!user?._id) return;

    const dataToSend = {
      _id: user._id,
      ...formData
    };
    
    mutate(dataToSend  ,{
      onError: (error: any) => {
        showErrorToast(error?.message || "An error occurred");
      },
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <Drawer
      title="Edit Admin"
      placement="right"
      onClose={onClose}
      open={!!user}
      width={600}
    >
      <form
        className="flex gap-5 p-5 rounded flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex flex-col">
            <label className={labelClasses}>First Name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={inputClasses}
              placeholder="First Name"
            />
          </div>
          <div className="flex flex-col">
            <label className={labelClasses}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Email"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex flex-col">
            <label className={labelClasses}>Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Last Name"
            />
          </div>
          <div className="flex flex-col">
            <label className={labelClasses}>Status:</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`${inputClasses} capitalize`}
              placeholder="Status"
            />
          </div>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          className="!h-[40px]"
        >
          {isPending ? <Spin size="small" /> : "Save"}
        </Button>
      </form>
    </Drawer>
  );
};

export default RightSidebar;