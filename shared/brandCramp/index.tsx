"use client";
import React from "react";
import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";
import { BrandCrump } from "@/util";

const BrandCrams: React.FC = () => {
  const pathname = usePathname();

  const items = [];

  const homeItem = BrandCrump.find((item) => item.path === "/");
  if (homeItem) {
    items.push({
      title: homeItem.title,
      href: homeItem.path,
    });
  }

  if (pathname !== "/") {
    const matched = BrandCrump.find((item) => item.path === pathname);
    if (matched) {
      items.push({
        title: matched.title,
        href: matched.path,
      });
    }
  }

  return (
    <Breadcrumb
      separator={pathname === "/" ? "" : ">"}
      items={items}
      className="dark:[&_.ant-breadcrumb-link]:text-white dark:[&_.ant-breadcrumb-separator]:text-white"
    />
  );
};

export default BrandCrams;
