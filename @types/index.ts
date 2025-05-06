import { LucideIcon } from "lucide-react";

export interface ChildrenType {
  children: React.ReactNode;
}

export type UserType = {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  image: string;
  role: string;
  token: string;
  status: string;
  active: boolean;
  is_deleted: boolean;
  work_date: string;
  work_end: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserEditType = {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  image: string;
  role: string;
  token: string;
  status: string;
  active: boolean;
  is_deleted: boolean;
  work_date: string;
  work_end: string | null;
  createdAt: string;
  updatedAt: string;
  onClose: () => void;
  visible: boolean;
  user: UserType;
};

export interface SidebarMenuType {
  id: number;
  title: string;
  path: string;
  Icons: LucideIcon;
  roles?: string[];
}

export interface ButtomsidebarMenuType {
  id: number;
  path: string;
  Icons: LucideIcon;
  roles?: string[];
}

export interface MenuDataType {
  id: number;
  path: string;
  Icons: LucideIcon;
  roles?: string[];
  title:string
}

export interface BrandCrumpType {
  id: number;
  title: string;
  path: string;
}

export interface TeacherType {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  field: string;
  image: string | null;
  status: string;
  salary: number;
  work_date: string;
  work_end: string | null;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
  groups: string[];
}

export interface ManagerType {
  key: string;
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
  active: boolean;
  createdAt: string;
  last_active_date: string;
  work_date: string;
  work_end: string | null;
  image: string;
}

export interface AdminType {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
  active: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  leave_history: any[];
  work_date: string;
  work_end: string | null;
}

export type AdminUserType = {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  image: string;
  role: string;
  status: string;
  active: boolean;
  is_deleted: boolean;
  work_date: string;
  work_end: string | null;
  createdAt: string;
  updatedAt: string;
};

export interface EditAdminType {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
}

export interface EditProfileImageType {
  first_name: string;
  last_name: string;
  email: string;
  image?: File;
}

export interface EditPasswordType {
  user_id: string;
  current_password: string;
  new_password: string;
}

export interface VacationType {
  _id: string;
  start_date: string;
  end_date: string;
  reason: string;
}

export interface TeacherType {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  field: string;
  image: string | null;
  status: string;
  salary: number;
  work_date: string;
  work_end: string | null;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
  groups: string[];
}
