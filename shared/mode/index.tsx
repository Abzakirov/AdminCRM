"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "antd";

export function DarkMode() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; 
  }

  const isLight = theme === "light";
  
  const toggleTheme = () => {
    const newTheme = isLight ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Button
      shape="circle"
      onClick={toggleTheme}
      icon={isLight ? <Moon size={18} color="#000" /> : <Sun size={18} color="#fff" />}
      style={{ border: "none", background: "transparent" }}
    />
  );
}