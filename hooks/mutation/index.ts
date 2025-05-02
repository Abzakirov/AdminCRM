"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../useAxios/useAxios";
import { showErrorToast, showSuccessToast } from "@/shared/toast/Toast";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { z } from "zod";
import type {
  AdminType,
  AdminUserType,
  EditAdminType,
  EditPasswordType,
  EditProfileImageType,
  UserType,
  VacationType,
} from "@/@types";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormData = z.infer<typeof loginSchema>;

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
      showSuccessToast("Muvaffaqiyatli tizimga kirildi!");
      router.push("/");
    },
    onError: (error: any) => {
      showErrorToast(
        error.response?.data?.message || error.message || "Email yoki parol noto‘g‘ri"
      );
    },
  });
};

export const useEditMutationCache = <T extends { _id: string }>(queryKey: string[]) => {
  const queryClient = useQueryClient();
  return (data: T) => {
    queryClient.setQueryData<T[] | undefined>(queryKey, (old) =>
      old?.map((item) => (item._id === data._id ? { ...item, ...data } : item))
    );
  };
};

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
      showSuccessToast("Admin muvaffaqiyatli tahrirlandi!");
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.message || "Xatolik yuz berdi!");
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
      showSuccessToast("Admin muvaffaqiyatli o‘chirildi!");
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.message || "Adminni o‘chirishda xatolik!");
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
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      showSuccessToast("Admin muvaffaqiyatli yaratildi!");
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.message || "Admin yaratishda xatolik!");
    },
  });
};

export const useEditProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-profile"],
    mutationFn: async (data: EditProfileImageType) => {
      const response = await axiosInstance.post("/auth/edit-profile", data);
      return response.data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      showSuccessToast("Profil muvaffaqiyatli tahrirlandi!");
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.message || "Profilni tahrirlashda xatolik!");
    },
  });
};

export const useEditProfileMutationCache = () => {
  const queryClient = useQueryClient();
  return (data: EditProfileImageType) => {
    return queryClient.setQueryData(["profiledata"], (old: EditProfileImageType | undefined) => {
      return { ...old, ...data };
    });
  };
};

export const useEditProfileImgMutation = () => {
  const mutationCache = useEditProfileMutationCache();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-profile-img"],
    mutationFn: async (data: { profileData: EditProfileImageType; image: File }) => {
      await mutationCache(data.profileData);

      const formData = new FormData();
      formData.append("image", data.image);

      const res = await axiosInstance.post("/auth/edit-profile-img", formData);
      const updatedImage = res.data.data.image;

      const updatedUser = {
        ...data.profileData,
        image: updatedImage,
      };

      Cookie.set("user", JSON.stringify(updatedUser));
      return updatedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiledata"] });
      showSuccessToast("Profil rasmi muvaffaqiyatli yangilandi!");
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.message || "Rasm yuklashda xatolik yuz berdi!");
    },
  });
};

export const useEditPasswordMutation = () => {
  return useMutation({
    mutationKey: ["edit-password"],
    mutationFn: async (data: EditPasswordType) => {
      const response = await axiosInstance.post("/auth/edit-password", data);
      return response.data.data;
    },
    onSuccess: () => {
      showSuccessToast("Parol muvaffaqiyatli o‘zgartirildi!");
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.message || "Parolni o‘zgartirishda xatolik!");
    },
  });
};

export const useVacationCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-vacation"],
    mutationFn: async (data: VacationType) => {
      const response = await axiosInstance.post("/staff/leave-staff", data);
      return response.data.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["vacations"] });
      try {
        const res = await axiosInstance.get("/staff/all-admins");
        queryClient.setQueryData(["admins"], res.data.data);
      } catch (error) {
        showErrorToast("Ta’til yaratilgandan so‘ng adminlar ro‘yxatini olishda xatolik yuz berdi.");
      }
      showSuccessToast("Admin  Ta’tilga  muvaffaqiyatli Chiqildi!");
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.message || "Ta’til yaratishda xatolik!");
    },
  });
};

export const useReturnVacationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["return-vacation"],
    mutationFn: async (_id: string) => {
      const response = await axiosInstance.post(`/staff/leave-exit-staff`, { _id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      showSuccessToast("Admin ta’tildan muvaffaqiyatli qaytdi!");
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.message || "Ta’tildan qaytishda xatolik!");
    },
  });
};

export const useReturnWorkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["return-work"],
    mutationFn: async (_id: string) => {
      const response = await axiosInstance.post(`/staff/return-work-staff`, { _id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      showSuccessToast("Admin ishga muvaffaqiyatli qaytarildi!");
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.message || "Ishga qaytishda xatolik!");
    },
  });
};


// TEachers

export const useTeacherCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-teacher"],
    mutationFn: async (data: AdminUserType) => {
      const response = await axiosInstance.post("/teacher/create-teacher", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      showSuccessToast("O'qituvchi muvaffaqiyatli yaratildi!");
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.message || "O'qituvchi yaratishda xatolik!");
    },
  });
};


export const useDeleteTeahcerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-teacher"],
    mutationFn: async (_id: string) => {
      const response = await axiosInstance.delete(`/teacher/fire-teacher`, { data: { _id } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      showSuccessToast("O‘qituvchi muvaffaqiyatli o‘chirildi!");
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.message || "O‘qituvchini o‘chirishda xatolik!");
    },
  });
};




export const useReturnTeacherWorkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["return-work"],
    mutationFn: async (_id: string) => {
      const response = await axiosInstance.post(`/teacher/return-teacher`, { _id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      showSuccessToast("O'qituvchi ishga muvaffaqiyatli qaytarildi!");
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.message || "Ishga qaytishda xatolik!");
    },
  });
};