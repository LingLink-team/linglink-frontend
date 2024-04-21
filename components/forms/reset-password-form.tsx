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

export default function ResetPasswordForm({ className, ...props }: UserAuthFormProps) {
    const router = useRouter()
    const [showPass, setShowPass] = React.useState<boolean>(false)
    const [showcpass, setShowCpass] = React.useState<boolean>(false)

    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const user_id = searchParams.get('id')

    const mutation = useMutation({
        mutationFn: async (values: any) => {
            try {
                let response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/resetPassword`, {
                    "userId": user_id,
                    "token": token,
                    "password": values.password,
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                toast.success("Đổi mật khẩu thành công")
                router.push('/login', { scroll: false })
                return response
            }
            catch (err: any) {
                toast.error("Đổi mật khẩu thất bại")
                router.push('/login', { scroll: false })
            }
        },
    })
    const loginform = useFormik({
        initialValues: {
            password: '',
            confirm_password: '',
        },
        validationSchema: Yup.object({
            password: Yup.string().min(8, 'Phải có ít nhất 8 ký tự').required('Cần nhập mật khẩu'),
            confirm_password: Yup.string().oneOf([Yup.ref('password'), ""], "Passwords don't match").min(8, 'Phải có ít nhất 8 ký tự').required('Cần nhập mật khẩu'),
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
                        <Label className="after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold" htmlFor="password">
                            Mật khẩu mới
                        </Label>
                        <Input
                            id="password"
                            placeholder="new password"
                            type={showPass ? "text" : "password"}
                            autoCapitalize="none"
                            autoCorrect="off"
                            onBlur={(event) => loginform.handleBlur(event)}
                            onChange={(event) => loginform.handleChange(event)}
                            value={loginform.values.password}
                            disabled={mutation.isPending}
                        />
                        {loginform.touched.password && loginform.errors.password ? (
                            <div className="text-red-600 ml-1 text-sm my-1">{loginform.errors.password}</div>
                        ) : <div className="opacity-0 text-sm my-1">OK</div>}
                        <Label className="after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold" htmlFor="password">
                            Xác nhận mật khẩu mới
                        </Label>
                        <Input
                            id="confirm_password"
                            placeholder="confirm new password"
                            type={showcpass ? "text" : "password"}
                            autoCapitalize="none"
                            autoCorrect="off"
                            onBlur={(event) => loginform.handleBlur(event)}
                            onChange={(event) => loginform.handleChange(event)}
                            value={loginform.values.confirm_password}
                            disabled={mutation.isPending}
                        />
                        {/* <div className="flex flex-row gap-4 my-1">
                            <Checkbox id="terms" onCheckedChange={() => {
                                setShowPass(!showpass)
                            }} />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Hiển thị mật khẩu
                            </label>
                        </div> */}
                        {loginform.touched.confirm_password && loginform.errors.confirm_password ? (
                            <div className="text-red-600 ml-1 text-sm my-1">{loginform.errors.confirm_password}</div>
                        ) : <div className="opacity-0 text-sm my-1">OK</div>}
                    </div>
                    <Button disabled={mutation.isPending} type="submit">
                        {mutation.isPending && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Xác nhận đổi mật khẩu
                    </Button>
                </div>
            </form>
        </div>
    )
}