"use client"

import React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "antd"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      type="text"
      onClick={toggleTheme}
      icon={
        theme === "dark" ? (
          <Moon className="w-5 h-5 !text-white" />
        ) : (
          <Sun className="w-5 h-5" />
        )
      }
    />
  )
}
