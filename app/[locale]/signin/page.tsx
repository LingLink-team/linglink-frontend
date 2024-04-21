"use client";
import Link from "next/link";
import Lottie from "lottie-react";
import educationAnimation from "@/app/assets/lotties/education.json";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import UserSignInForm from "@/components/forms/user-register-form";
import logo from "@/app/assets/images/linglink.png";
import Image from "next/image";

export default function SignIn() {
  return (
    <>
      <div className="container relative hidden h-screen bg-background flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Đăng nhập
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-[#5f99e4]" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <div className="relative z-20 flex text-center justify-center w-full items-center text-[60px] gap-4 font-bold text-white">
              <Image src={logo} className="h-[100px] w-[100px]" alt="logo" />
              Ling Link
            </div>
          </div>
          <div className="relative z-20 mt-8">
            <Lottie animationData={educationAnimation} loop={true} />
            <div className="mt-6 animate-typing overflow-hidden whitespace-nowrap border-r-4 pr-2 border-r-white text-2xl text-white font-bold">
              LingLink - ứng dụng cộng đồng học ngôn ngữ bổ ích.
            </div>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Tạo tài khoản mới
              </h1>
              <p className="text-sm text-muted-foreground">
                Nhập email của bạn vào bên dưới để tiến hành tạo tài khoản
              </p>
            </div>
            <UserSignInForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              Bằng cách nhấp tiếp tục, bạn đồng ý với{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Điều khoản dịch vụ
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Chính sách quyền riêng tư{" "}
              </Link>
              của chúng tôi..
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
