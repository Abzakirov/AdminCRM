'use client';

import { showErrorToast } from "@/shared/toast/Toast";
import { Button } from "antd";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

interface Props {
  showDrawer: () => void;
}

const OpenDrawerTeacherButton: React.FC<Props> = ({ showDrawer }) => {
  const [user, setUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    const res = Cookies.get("user");
    if (res) {
      try {
        const parsed = JSON.parse(res);
        setUser(parsed);
      } catch (error) {
        console.error("Failed to parse user cookie", error);
      }
    }
  }, []);

  const handleClick = () => {
    if (user?.role === "manager") {
      showDrawer();
    } else {
      showErrorToast("Faqat admin bo‘lishingiz kerak");
    }
  };

  if (!user) return null;

  return (
    <Button type="primary" onClick={handleClick}>
      Create Teacher
    </Button>
  );
};

export default OpenDrawerTeacherButton;
