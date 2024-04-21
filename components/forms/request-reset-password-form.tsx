"use client"

import * as React from "react"

import { useMutation } from '@tanstack/react-query';
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormik } from 'formik';
import { useAppDispatch } from "@/app/redux/store"
import { useRouter } from 'next/navigation'
import axios from "axios"
import * as Yup from 'yup';
import { toast } from "react-toastify";
import { useSearchParams } from 'next/navigation'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function RequestResetPasswordForm({ className, ...props }: UserAuthFormProps) {
    const mutation = useMutation({
        mutationFn: async (values: any) => {
            try {
                let response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/requestPasswordReset`, {
                    "email": values.email,
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                toast.success("Link đổi mật khẩu đã được gửi đến email của bạn")
                return response
            }
            catch (err: any) {
                toast.error("Email không tồn tại!")
            }
        },
    })
    const loginform = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Địa chỉ email không hợp lệ').required('Cần nhập email'),
        }),
        onSubmit: async (values) => {
            try {
                mutation.mutate(values);
            } catch (error: any) {
                console.log(error)
            }
        },
    });
    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={loginform.handleSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1 mb-5">
                    <Label className="after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold" htmlFor="email">
                            Địa chỉ Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            onBlur={(event) => loginform.handleBlur(event)}
                            onChange={(event) => loginform.handleChange(event)}
                            value={loginform.values.email}
                            disabled={mutation.isPending}
                        />
                        {loginform.touched.email && loginform.errors.email ? (
                            <div className="text-red-600 ml-1 text-sm my-1">{loginform.errors.email}</div>
                        ) : <div className="opacity-0 text-sm my-1">OK</div>}
                    </div>
                    <Button disabled={mutation.isPending} type="submit">
                        {mutation.isPending && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Xác nhận Email
                    </Button>
                </div>
            </form>
        </div>
    )
}