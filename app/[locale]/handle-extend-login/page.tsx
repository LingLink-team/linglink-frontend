"use client";
import { useAppDispatch } from "@/app/redux/store";
import { setCookie } from "cookies-next";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { setInfor, setToken, TokenPayload } from "@/app/redux/slices/authSlice";
import createAxiosInstance from "@/app/utils/axiosInstance";
import { connectSocket } from "@/app/services/socketService";

export default async function HandleExtendLogin() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const accessToken = searchParams.get('accessToken') ?? ""
  const refreshToken = searchParams.get('refreshToken') ?? ""
    
  if (!accessToken || !refreshToken) router.push('/login', { scroll: false })
  const token: TokenPayload = {accessToken: accessToken, refreshToken: refreshToken}

  setCookie("accessToken", accessToken);
  setCookie("refreshToken", refreshToken);
  dispatch(setToken(token));
  toast.success("Đăng nhập thành công");
  let axiosJWT = createAxiosInstance();
  let userinfor = await axiosJWT.get("/user/me");
  dispatch(setInfor(userinfor.data));
  connectSocket();
  router.push("/", { scroll: false });
  return <div>Loading . . .</div>;
};

