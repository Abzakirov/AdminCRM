import { ForwardRefExoticComponent } from "react";


export interface ChildrenType {
    children: React.ReactNode
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


export interface SidebarMenuType {
    id: number;
    title: string;
    path: string;
    Icons: any
}
export interface BrandCrumpType {
    id: number;
    title: string;
    path: string;
}