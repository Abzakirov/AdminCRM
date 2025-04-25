import { BrandCrumpType, SidebarMenuType } from "@/@types";
import {
  CircleUserRound,
  Component,
  ContactRound,
  LayoutGrid,
  Settings,
  ShieldUser,
  UserRoundPen,
  Users,
} from "lucide-react";

export const sidebarMenu: SidebarMenuType[] = [
  {
    id: 1,
    title: "Asosiy",
    path: "/",
    Icons: LayoutGrid,
  },
  {
    id: 2,
    title: "Menegers",
    path: "/managers",
    Icons: ShieldUser,
  },
  {
    id: 3,
    title: "Admins",
    path: "/admins",
    Icons: ContactRound,
  },
  {
    id: 4,
    title: "Teachers",
    path: "/teachers",
    Icons: UserRoundPen,
  },
  {
    id: 5,
    title: "Students",
    path: "/students",
    Icons: Users,
  },
  {
    id: 6,
    title: "Groups",
    path: "/groups",
    Icons: Component,
  },
];

export const others_menu: SidebarMenuType[] = [
  {
    id: 1,
    title: "Settings",
    path: "/settings",
    Icons: Settings,
  },
  {
    id: 2,
    title: "Profile",
    path: "/profile",
    Icons: CircleUserRound,
  },
 
];


export const BrandCrump: BrandCrumpType[] = [
  {
    id: 1,
    title: "Asosiy",
    path: "/",
  },
  {
    id: 2,
    title: "Menegers",
    path: "/managers",
  },
  {
    id: 3,
    title: "Admins",
    path: "/admins",
  },
  {
    id: 4,
    title: "Teachers",
    path: "/teachers",
  },
  {
    id: 5,
    title: "Students",
    path: "/students",
  },
  {
    id: 6,
    title: "Groups",
    path: "/groups",
  },
  {
    id: 7,
    title: "Settings",
    path: "/settings",
  },
  {
    id: 8,
    title: "Profile",
    path: "/profile",
  },
 
];