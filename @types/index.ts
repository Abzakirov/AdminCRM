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
  title: string;
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
  leave_history?: LeaveType[];

  work_date: string;
  work_end: string | null;
}


export type StudentUserType = {
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


export interface LeaveType {
  _id: string;
  start_date: string;
  end_date: string;
  reason: string;
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

export interface searchGroupType {
  _id: string;
  name: string;
}

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


export type StudentType = {
  _id: string;
  first_name: string;
  last_name: string;
  status: string;
  is_deleted: boolean;
  phone: string;
  createdAt: string;
  updatedAt: string;
  leave_history: any[];
  groups: any[];
  teacher: string};




export type GroupType = {
  _id: string;
  name: string;
};


export interface LeaveHistoryType{
  _id: string;
  start_date: string;
  end_date: string;
  reason: string;
  days:number
}

export type GroupStudentEntry = {
  exitedAt: string;
  joinedAt: string;
  payments: any[]; 
  status: string; 
  group: {
    _id: string;
    name: string;
    teacher: string;
    students: string[]; 
    started_group: string;
    end_group: string;
    createdAt: string;
    updatedAt: string;
    disable: boolean;
    is_deleted: boolean;
  };
};



