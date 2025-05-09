import {
  BrandCrumpType,
  ButtomsidebarMenuType,
  MenuDataType,
  SidebarMenuType,
} from "@/@types";
import {
  CircleUserRound,
  Component,
  ContactRound,
  GraduationCap,
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
    roles: ["admin", "manager", "teacher", "student","raxbar"],
  },
  {
    id: 2,
    title: "Manajerlar",
    path: "/managers",
    Icons: ShieldUser,
    roles: ["manager","raxbar"],
  },
  {
    id: 3,
    title: "Adminlar",
    path: "/admins",
    Icons: ContactRound,
    roles: ["admin", "manager","raxbar"],
  },
  {
    id: 4,
    title: "O'qituvchilar",
    path: "/teachers",
    Icons: UserRoundPen,
    roles: ["admin", "manager","raxbar"],
  },
  {
    id: 5,
    title: "O'quvchilar",
    path: "/students",
    Icons: Users,
    roles: ["admin", "manager", "teacher","raxbar"],
  },
  {
    id: 6,
    title: "Groups",
    path: "/groups",
    Icons: Component,
    roles: ["admin", "manager", "teacher","raxbar"],
  },
  {
    id: 7,
    title: "Courses",
    path: "/courses",
    Icons: GraduationCap,
    roles: ["admin", "manager", "teacher","raxbar"],
  },
];

export const ButtomsidebarMenu: ButtomsidebarMenuType[] = [
  {
    id: 1,
    path: "/",
    Icons: LayoutGrid,
    roles: ["admin", "manager", "teacher", "student","raxbar"],
  },

  {
    id: 2,
    path: "/settings",
    Icons: Settings,
    roles: ["admin", "manager", "teacher", "student","raxbar"],
  },
  {
    id: 3,
    path: "/profile",
    Icons: CircleUserRound,
    roles: ["admin", "manager", "teacher", "student","raxbar"],
  },
];

export const MenuData: MenuDataType[] = [
  {
    id: 1,
    path: "/managers",
    Icons: ShieldUser,
    roles: ["manager","raxbar"],
    title: "Manajerlar",
  },
  {
    id: 2,
    path: "/admins",
    title: "Adminlar",
    Icons: ContactRound,
    roles: ["admin", "manager","raxbar"],
  },
  {
    id: 3,
    path: "/teachers",
    Icons: UserRoundPen,
    title: "O'qituvchilar",
    roles: ["admin", "manager","raxbar"],
  },
  {
    id: 4,
    path: "/students",
    title: "O'quvchilar",
    Icons: Users,
    roles: ["admin", "manager", "teacher","raxbar"],
  },
  {
    id: 5,
    path: "/groups",
    title: "Groups",
    Icons: Component,
    roles: ["admin", "manager", "teacher","raxbar"],
  },
  {
    id: 6,
    path: "/courses",
    title: "Courses",
    Icons: GraduationCap,
    roles: ["admin", "manager", "teacher","raxbar"],
  },
];
export const others_menu: SidebarMenuType[] = [
  {
    id: 1,
    title: "Sozlamalar",
    path: "/settings",
    Icons: Settings,
    roles: ["admin", "manager", "teacher", "student","raxbar"],
  },
  {
    id: 2,
    title: "Profil",
    path: "/profile",
    Icons: CircleUserRound,
    roles: ["admin", "manager", "teacher", "student","raxbar"],
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
  {
    id: 9,
    title: "Courses",
    path: "/courses",
  },
];
