import { SidebarMenuType } from "@/@types";
import { Component, ContactRound, LayoutGrid, ShieldUser, UserRoundPen, Users } from "lucide-react";

export const sidebarMenu: SidebarMenuType[] = [
  {
    id: 1,
    title: "Asosiy",
    path: "/",
    Icons:LayoutGrid 
  },
  {
    id: 2,
    title: "Menegers",
    path: "/menegers",
    Icons: ShieldUser ,
  },
  {
    id: 3,
    title: "Admins",
    path: "/admins",
    Icons: ContactRound 
  },
  {
    id: 4,
    title: "Teachers",
    path: "/Teachers",
    Icons: UserRoundPen
  },
  {
    id: 5,
    title: "Students",
    path: "/students",
    Icons: Users
  },
  {
    id: 6,
    title: "Groups",
    path: "/groups",
    Icons: Component
  }
];
