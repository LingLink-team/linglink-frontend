"use client"
import axios, { AxiosInstance } from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { toast } from "react-toastify"

const createAxiosInstance = (): AxiosInstance => {
    let accessToken = getCookie('accessToken');
    let refreshToken = getCookie('refreshToken');
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    instance.interceptors.request.use(
        async (config) => {
            config.headers.Authorization = `Bearer ${accessToken}`;
            return config;
        },
        (error) => {
            throw error;
        }
    );

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            console.log(error)
            if (error?.response && error?.response?.status === 401) {
                try {
                    const refreshResponse = await instance.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/refreshToken`, { token: refreshToken });
                    const newAccessToken = refreshResponse.data.accessToken;

                    instance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                    setCookie("accessToken", newAccessToken)
                    setCookie("refreshToken", refreshResponse.data.refreshToken)
                    const originalRequest = error.config;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                } catch (refreshError) {
                    console.log(refreshError)
                    deleteCookie("accessToken")
                    deleteCookie("refreshToken")
                    window.location.href = '/login';
                    toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại")
                    throw refreshError
                }
            }
            if (error.response?.data) toast.error(error.response.data.message)
            else toast.error(error.message)
            throw error;
        }
    );

    return instance;
};

export default createAxiosInstance;
