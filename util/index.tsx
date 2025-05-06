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
    roles: ["admin", "manager", "teacher", "student"], 
  },
  {
    id: 2,
    title: "Manajerlar",
    path: "/managers",
    Icons: ShieldUser,
    roles: ["manager"],
  },
  {
    id: 3,
    title: "Adminlar",
    path: "/admins",
    Icons: ContactRound,
    roles: ["admin", "manager"], 
  },
  {
    id: 4,
    title: "O'qituvchilar",
    path: "/teachers",
    Icons: UserRoundPen,
    roles: ["admin", "manager"],
  },
  {
    id: 5,
    title: "O'quvchilar",
    path: "/students",
    Icons: Users,
    roles: ["admin", "manager", "teacher"],
  },
  {
    id: 6,
    title: "Groups",
    path: "/groups",
    Icons: Component,
    roles: ["admin", "manager", "teacher"],
  },
];

export const others_menu: SidebarMenuType[] = [
  {
    id: 1,
    title: "Sozlamalar",
    path: "/settings",
    Icons: Settings,
    roles: ["admin", "manager", "teacher", "student"], 
  },
  {
    id: 2,
    title: "Profil",
    path: "/profile",
    Icons: CircleUserRound,
    roles: ["admin", "manager", "teacher", "student"], 
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


