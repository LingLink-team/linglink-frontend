"use client"
import { useState, useEffect } from "react";
import logo from "@/app/assets/images/linglink.png"
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IoNotifications } from "react-icons/io5";
import { ImHome } from "react-icons/im";
import { GiBookshelf } from "react-icons/gi";
import { GiCardExchange } from "react-icons/gi";
import { PiExam } from "react-icons/pi";
import { GrSchedules } from "react-icons/gr";
import {
    CreditCard,
    LifeBuoy,
    LogOut,
    Settings,
    User,
    Languages,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { deleteInfor } from "@/app/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/store";
import { toast } from "react-toastify";
import { disconnectSocket } from "@/app/services/socketService";

export default function Header() {
    const [isSticky, setIsSticky] = useState(false);
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.auth.userinfor)
    const pathname = usePathname()
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            // Chỉ kích hoạt sticky khi scroll xuống đủ một khoảng cụ thể, ví dụ: 100px
            setIsSticky(scrollPosition > 80);
        };

        // Thêm sự kiện lắng nghe scroll
        window.addEventListener('scroll', handleScroll);

        // Xóa sự kiện khi component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const router = useRouter()
    const changeLang = (lang: string) => {
        router.replace(`/${lang}`, { scroll: false })
    }
    const handleLogout = () => {
        // Xóa cookie khi người dùng đăng xuất
        try {
            dispatch(deleteInfor());
            deleteCookie("accessToken");
            deleteCookie("refreshToken");
            disconnectSocket();
            toast.success("Đăng xuất thành công")
            router.push("/login")
        }
        catch (err: any) {
            toast.error(err)
        }
    };
    return (
        <div className={`h-full rounded-md w-full z-10 shadow-md bg-background sticky top-0`}>
            <div
                className={`w-full container flex flex-row gap-12 justify-between items-center`}
            >
                <div className="flex flex-row gap-2 items-center py-4 basis-1/4">
                    <div>
                        <Image className="h-[50px] w-[50px]" src={logo} alt="logo" />
                    </div>
                    <div className="text-3xl font-semibold text-primary">
                        Ling Link
                    </div>
                </div>
                <div className="basis-1/2">
                    <div className="grid grid-cols-5 items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link href="/">
                                        <div className={`flex justify-center h-full px-4 py-2 ${pathname === "/" ? "text-primary" : "text-slate-400"}  hover:bg-slate-200 rounded-md`}>
                                            <Link href="/">
                                                <ImHome className="text-2xl" />
                                            </Link>
                                        </div>
                                    </Link>
                                    {
                                        pathname === "/" ? <div className="w-full border-b-4 border-primary"></div> : ""
                                    }
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Home</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link href="/course">
                                        <div className={`flex justify-center h-full px-4 py-2 border-primary ${pathname === "/course" ? "text-primary" : "text-slate-400"} border-b-0 hover:bg-slate-200 rounded-md`}>
                                            <GiBookshelf className="text-2xl" />
                                        </div>
                                    </Link>
                                    {
                                        pathname === "/course" ? <div className="w-full border-b-4 border-primary"></div> : ""
                                    }
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Danh sách khóa học</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link href="/flashcard">
                                        <div className={`flex justify-center h-full px-4 py-2 border-primary ${pathname === "/flashcard" ? "text-primary" : "text-slate-400"} border-b-0 hover:bg-slate-200 rounded-md`}>
                                            <GiCardExchange className="text-2xl" />
                                        </div>
                                    </Link>
                                    {
                                        pathname === "/flashcard" ? <div className="w-full border-b-4 border-primary"></div> : ""
                                    }
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Flashcard</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link href="/exam">
                                        <div className={`flex justify-center h-full px-4 py-2 border-primary ${pathname === "/exam" ? "text-primary" : "text-slate-400"} border-b-0 hover:bg-slate-200 rounded-md`}>
                                            <PiExam className="text-2xl" />
                                        </div>
                                    </Link>
                                    {
                                        pathname === "/exam" ? <div className="w-full border-b-4 border-primary"></div> : ""
                                    }
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Làm đề thi</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link href="/schedule">
                                        <div className={`flex justify-center h-full px-4 py-2 border-primary ${pathname === "/schedule" ? "text-primary" : "text-slate-400"} border-b-0 hover:bg-slate-200 rounded-md`}>
                                            <GrSchedules className="text-2xl" />
                                        </div>
                                    </Link>
                                    {
                                        pathname === "/schedule" ? <div className="w-full border-b-4 border-primary"></div> : ""
                                    }
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Thời khóa biểu</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <div className="flex gap-6 py-4 basis-1/4 justify-end">
                    <div className="relative flex items-center">
                        <IoNotifications className="text-2xl text-slate-400" />
                        <span className="w-[10px] absolute right-0 top-[5px] h-[10px] rounded-full bg-red-500"></span>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarImage className="cursor-pointer" src={user.avatar} alt="@shadcn" />
                                <AvatarFallback>{user.name}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Thông tin cá nhân</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Đổi mật khẩu</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <Languages className="mr-2 h-4 w-4" />
                                        <span>Ngôn ngữ</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem onClick={() => changeLang("vi")}>
                                                <Image className="mr-2 h-4 w-6" height={0} width={0} alt="Vietnam flag" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAABPCAMAAADmzqp4AAAAY1BMVEXaJR3//wDYAB754gnZHh3WAB/ZFB7kdxjjchj65wnYCx7++AT21QzxvxDcNxznhxbmghflfhf0zg3bLx3zyA776wfdRRvqmRTusBLgXxreTxvtqRP88AbsoxPfVBvrnxTojhZLYPKuAAABlUlEQVRoge2Y3XKCMBBGzZoESAB/EBER8P2fspgKVEHrdNhNL/Z44wwzHvnY5IuuVgzDMAzD/AXpR6tr7UMrU5H6uGO9ERsfNwyxiMGD1wghDL1Wbzvvlj7oLmbhJWhxg9yqd867ow4a9s67pw46s85rM1qtDsQ3AW3QcLh7D7RBg+gh9cpw8IaY3SDhEZUM3kQ9XVvwe8gqXz8iRp6u5NWCYriKT7ku+sDNMfrIGh0XrigJpw+0pyWf7h0I7S9WG6IsKp3Fb7VxhrV3qeKNtlB4Kxma/IU1b1A3LqmTWW2isY+0EEzHy+4IdmkIJ16cOX72ThfyicJrLhPvheAcLcuZsSrxfyjN7pcEQeu5gojQg5bn0bYf356xgzbVsGhDNTZFhX3Dqp/meKW7V98UF4WrHWIuXNNKKGiCNrWzjC3QN0WNGzS4af7ZAvemiHDrqLk5gkcHuN8sDWbQpu0GanJ0M8duvFrMoM1a1DNHNwmtWCN65dmW888RSos40bJMXx3ddIrZDe8+2tO/lQzDMAzDMP+ML8rKDZb3zOkjAAAAAElFTkSuQmCC" />
                                                <span>Tiếng Việt</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => changeLang("en")}>
                                                <Image className="mr-2 h-4 w-6" height={0} width={0} alt="UN flag" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Great_Britain_%281707%E2%80%931800%29.svg/255px-Flag_of_Great_Britain_%281707%E2%80%931800%29.svg.png" />
                                                <span>Tiếng Anh</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <LifeBuoy className="mr-2 h-4 w-4" />
                                <span>Hỗ trợ</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Đăng xuất</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}