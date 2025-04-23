"use client";

import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../useAxios/useAxios";
import { showErrorToast, showSuccessToast } from "@/shared/toast/Toast";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import type  { UserType } from "@/@types";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export const useLoginMutation = () => {
    const router = useRouter()
    return useMutation({
        mutationKey: ["login"],
        mutationFn: async (data: FormData) => {
            const response = await axiosInstance.post("/auth/sign-in", data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data.data;
        },
        onSuccess: (data: UserType) => {
            let token = data.token
            Cookie.set("user", JSON.stringify(data), { expires: 1 / 24 });
            Cookie.set("token", token, { expires: 1 / 24 });
            showSuccessToast("Login successful!");
            router.push('/')
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message
                || error.message
                || "Email or password is incorrect";
            showErrorToast(errorMessage);
        },
    });
};