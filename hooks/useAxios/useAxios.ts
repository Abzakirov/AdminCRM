import axios from "axios";
import Cookie from "js-cookie";

export const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${Cookie.get("token")}`,
    }
});
