"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../useAxios/useAxios";
import { showErrorToast, showSuccessToast } from "@/shared/toast/Toast";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { z } from "zod";
import type { AdminType, AdminUserType, EditAdminType, UserType } from "@/@types";
import { EditProfileType } from "@/shared/editProfileDrawer/EditProfileDrawer";

// Login schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormData = z.infer<typeof loginSchema>;

// --- LOGIN MUTATION ---
export const useLoginMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: FormData) => {
      const response = await axiosInstance.post("/auth/sign-in", data);
      return response.data.data;
    },
    onSuccess: (data: UserType) => {
      Cookie.set("user", JSON.stringify(data), { expires: 1 / 24 });
      Cookie.set("token", data.token, { expires: 1 / 24 });
      showSuccessToast("Login successful!");
      router.push("/");
    },
    onError: (error: any) => {
      showErrorToast(
        error.response?.data?.message || error.message || "Email or password is incorrect"
      );
    },
  });
};

// --- GENERIC CACHE EDIT ---
export const useEditMutationCache = <T extends { _id: string }>(queryKey: string[]) => {
  const queryClient = useQueryClient();
  return (data: T) => {
    queryClient.setQueryData<T[] | undefined>(queryKey, (old) =>
      old?.map((item) => (item._id === data._id ? { ...item, ...data } : item))
    );
  };
};

// --- EDIT ADMIN MUTATION ---
export const useEditAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-admin"],
    mutationFn: async (data: EditAdminType) => {
      const response = await axiosInstance.post("/staff/edited-admin", data);
      return response.data.data;
    },
    onSuccess: (data: AdminType) => {
      queryClient.setQueryData<AdminType[]>(["admins"], (old) =>
        old?.map((admin) => (admin._id === data._id ? { ...admin, ...data } : admin))
      );
      showSuccessToast("Admin successfully edited!");
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.message || "Something went wrong!");
    },
  });
};

export const useDeleteAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-admin"],
    mutationFn: async (_id: string) => {
      const response = await axiosInstance.delete(`/staff/deleted-admin`, { data: { _id } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      showSuccessToast("Admin successfully deleted!");
    },
    onError: (error: any) => {
      showErrorToast(
        error?.response?.data?.message || "Failed to delete admin!"
      );
    },
  });
};

export const useAdminCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-admin"],
    mutationFn: async (data: AdminUserType) => {
      const response = await axiosInstance.post("/staff/create-admin", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:["admins"]
      });
      showSuccessToast("Admin successfully created!");
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.message || "Failed to create admin!");
    },
  });
};


export const useEditProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-profile"],
    mutationFn: async (data: EditProfileType) => {
      const response = await axiosInstance.post("/auth/edit-profile", data);
      return response.data.data;
    },
    onSuccess() {
     queryClient.invalidateQueries({
        queryKey:["admins"]
      });
      showSuccessToast("Profile successfully edited!");
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.message || "Failed to create admin!");
    },
  })
}