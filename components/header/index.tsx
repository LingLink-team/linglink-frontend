"use client";
import { useState, useEffect, useCallback } from "react";
import logo from "@/app/assets/images/linglink.png";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IoNotifications } from "react-icons/io5";
import { ImHome } from "react-icons/im";
import { GiBookshelf } from "react-icons/gi";
import { GiCardExchange } from "react-icons/gi";
import { GrSchedules } from "react-icons/gr";
import { CreditCard, LifeBuoy, LogOut, User, Languages } from "lucide-react";

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
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { deleteInfor } from "@/app/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/store";
import { toast } from "react-toastify";
import { disconnectSocket } from "@/app/services/socketService";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useFormik } from "formik";
import { PasswordInput } from "../forms/input";
import { NotificationService, UserService } from "@/app/services";
import { useSocketStore } from "@/app/store/socketStore";
import { FaUserFriends } from "react-icons/fa";
import { RiBookFill } from "react-icons/ri";
import Dictionary from "../dictionary";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useQuery } from "@tanstack/react-query";
import { Icons } from "../icons/icons";
import { format } from "date-fns";

function Notification({ notification, setNotis, notis }: any) {
  const [isViewed, setIsViewed] = useState<boolean>(notification?.isViewed);
  const handleView = async () => {
    if (!notification.isViewed) {
      await NotificationService.view([notification._id]);
      setIsViewed(true);
      const newNotis = notis?.map((item: any) => {
        const newItem = item;
        newItem.isViewed = true;
        return newItem;
      });
      setNotis(newNotis);
    }
  };
  return (
    <div className="hover:bg-secondary transition-all duration-300 rounded-md p-2 relative">
      <div
        onClick={handleView}
        className={`flex justify-between items-center ${
          !isViewed && "cursor-pointer"
        }`}
      >
        <div className="flex gap-2 items-center text-sm font-semibold">
          <Avatar>
            <AvatarImage src={notification.sender?.avatar} />
            <AvatarFallback>{notification.sender.name}</AvatarFallback>
          </Avatar>
          {notification.sender.name}
        </div>
        <div className="text-[12px] text-slate-400 ml-2">
          {format(new Date(notification.createdAt), "yyyy-MM-dd HH:mm:ss")}
        </div>
      </div>
      <div className="space-y-2 mt-2">
        <p className="text-slate-500 text-sm">{notification.title}</p>
      </div>
      {!isViewed && (
        <div className="absolute w-3 h-3 bg-blue-600 top-1/2 right-1 rounded-full" />
      )}
    </div>
  );
}

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.userinfor);
  const pathname = usePathname();
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Chỉ kích hoạt sticky khi scroll xuống đủ một khoảng cụ thể, ví dụ: 100px
      setIsSticky(scrollPosition > 80);
    };

    // Thêm sự kiện lắng nghe scroll
    window.addEventListener("scroll", handleScroll);

    // Xóa sự kiện khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const router = useRouter();
  const changeLang = (lang: string) => {
    router.replace(`/${lang}`, { scroll: false });
  };
  const { socket, setSocket } = useSocketStore();
  const handleLogout = () => {
    // Xóa cookie khi người dùng đăng xuất
    try {
      dispatch(deleteInfor());
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      disconnectSocket(socket);
      toast.success("Đăng xuất thành công");
      router.push("/login");
    } catch (err: any) {
      toast.error(err);
    }
  };
  const ChangePasswordDialog = () => {
    const changePasswordFormik = useFormik({
      initialValues: {
        oldpassword: "",
        newpassword: "",
        confirmpassword: "",
      },
      validate: (values) => {
        const errors: any = {};
        if (!values.oldpassword) {
          errors.oldpassword = "Vui lòng nhập mật khẩu cũ";
        }
        if (!values.newpassword) {
          errors.newpassword = "Vui lòng nhập mật khẩu mới";
        } else {
          if (values.newpassword.length <= 8) {
            errors.newpassword = "Mật khẩu phải ít nhất 9 ký tự";
          }
          if (values.newpassword === values.oldpassword) {
            errors.newpassword = "Mật khẩu phải khác mật khẩu cũ";
          }
        }
        if (!values.confirmpassword) {
          errors.confirmpassword = "Vui lòng nhập lại mật khẩu";
        } else if (values.newpassword !== values.confirmpassword) {
          errors.confirmpassword = "Mật khẩu không khớp";
        }
        return errors;
      },
      onSubmit: async (values) => {
        const data = {
          oldPassword: values.oldpassword,
          newPassword: values.newpassword,
        };
        const result = await UserService.changePassword(data);
        toast.success("Đổi mật khẩu thành công");
        setIsOpenDialog(false);
      },
    });
    const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
    return (
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogTrigger>
          <div className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Đổi mật khẩu
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogDescription>
              Vui lòng điền các thông tin bên dưới để tiến hành đổi mật khẩu
            </DialogDescription>
            <div className="flex flex-col gap-2">
              <div>
                <Label
                  className={`after:content-['*'] after:text-red-500 after:ml-1`}
                  htmlFor="oldpassword"
                >
                  Mật khẩu cũ
                </Label>
                <PasswordInput
                  id="oldpassword"
                  placeholder="Nhập mật khẩu cũ"
                  onChange={changePasswordFormik.handleChange}
                  onBlur={changePasswordFormik.handleBlur}
                  value={changePasswordFormik.values.oldpassword}
                />
              </div>
              {changePasswordFormik.touched.oldpassword &&
              changePasswordFormik.errors.oldpassword ? (
                <div className="text-red-500 text-sm">
                  {changePasswordFormik.errors.oldpassword}
                </div>
              ) : null}
              <div>
                <Label
                  className={`after:content-['*'] after:text-red-500 after:ml-1`}
                  htmlFor="oldpassword"
                >
                  Mật khẩu mới
                </Label>
                <div className="relative">
                  <PasswordInput
                    id="newpassword"
                    placeholder="Nhập mật khẩu mới"
                    onChange={changePasswordFormik.handleChange}
                    onBlur={changePasswordFormik.handleBlur}
                    value={changePasswordFormik.values.newpassword}
                  />
                </div>
              </div>
              {changePasswordFormik.touched.newpassword &&
              changePasswordFormik.errors.newpassword ? (
                <div className="text-red-500 text-sm">
                  {changePasswordFormik.errors.newpassword}
                </div>
              ) : null}
              <div>
                <Label
                  className={`after:content-['*'] after:text-red-500 after:ml-1`}
                  htmlFor="oldpassword"
                >
                  Nhập lại mật khẩu
                </Label>
                <PasswordInput
                  id="confirmpassword"
                  placeholder="Nhập lại mật khẩu"
                  onChange={changePasswordFormik.handleChange}
                  onBlur={changePasswordFormik.handleBlur}
                  value={changePasswordFormik.values.confirmpassword}
                />
              </div>
              {changePasswordFormik.touched.confirmpassword &&
              changePasswordFormik.errors.confirmpassword ? (
                <div className="text-red-500 text-sm">
                  {changePasswordFormik.errors.confirmpassword}
                </div>
              ) : null}
            </div>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button
              onClick={() => changePasswordFormik.handleSubmit()}
              type="submit"
              disabled={changePasswordFormik.isSubmitting}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const [notifications, setNotifications] = useState<any[]>([]);
  const [lastNoti, setLastNoti] = useState<any>("");
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const { refetch, isLoading } = useQuery({
    queryKey: ["notification", user._id],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!isEnd) {
        const newData = await NotificationService.get(lastNoti);
        setLastNoti(newData.data?.slice(-1)[0]?._id);
        if (notifications.length > 20 && newData.data.length > 0) {
          setNotifications(() => {
            const updated = [...newData.data];
            return updated;
          });
        } else {
          setNotifications((prevData: any) => {
            const updated = [...prevData, ...newData.data];
            return updated;
          });
          if (newData.data.length === 0) {
            setIsEnd(true);
          }
        }
        return newData.data;
      }
      return [];
    },
  });

  const elRef = useCallback(
    (node: any) => {
      if (node !== null) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              // Gọi hàm fetch data
              refetch();
            }
          },
          { threshold: 0 }
        );

        if (node) {
          observer.observe(node);
        }

        return () => {
          if (node) {
            observer.unobserve(node);
          }
        };
      }
    },
    [notifications]
  );

  const handleNotifications = () => {
    if (socket) {
      socket.on("notification", (noti: any) => {
        const newNoti = { ...noti, createdAt: new Date() };
        toast(noti.sender.name + noti.title);
        setNotifications((prev) => [newNoti, ...prev]);
      });
    }
  };

  useEffect(() => {
    handleNotifications();
  }, [socket]);

  return (
    <div
      className={`h-full rounded-md w-full z-10 shadow-md bg-background sticky top-0 max-h-[56px]`}
    >
      <div
        className={`w-full container flex flex-row gap-12 justify-between items-center`}
      >
        <div className="flex flex-row gap-2 items-center pb-2 basis-1/4">
          <div>
            <Link href="/">
              <Image className="h-[50px] w-[50px]" src={logo} alt="logo" />
            </Link>
          </div>
          <div className="text-3xl font-semibold text-primary">
            <Link href="/">Ling Link</Link>
          </div>
        </div>
        <div className="basis-1/2">
          <div className="grid grid-cols-5 items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link href="/">
                    <div
                      className={`flex justify-center h-full px-4 py-2 ${
                        pathname === "/" ? "text-primary" : "text-slate-500"
                      }  hover:bg-slate-200 rounded-md`}
                    >
                      <Link href="/">
                        <ImHome className="text-2xl" />
                      </Link>
                    </div>
                  </Link>
                  {pathname === "/" ? (
                    <div className="w-full border-b-4 border-primary"></div>
                  ) : (
                    ""
                  )}
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
                    <div
                      className={`flex justify-center h-full px-4 py-2 border-primary ${
                        pathname.split("/").includes("course")
                          ? "text-primary"
                          : "text-slate-500"
                      } border-b-0 hover:bg-slate-200 rounded-md`}
                    >
                      <GiBookshelf className="text-2xl" />
                    </div>
                  </Link>
                  {pathname.split("/").includes("course") ? (
                    <div className="w-full border-b-4 border-primary"></div>
                  ) : (
                    ""
                  )}
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
                    <div
                      className={`flex justify-center h-full px-4 py-2 border-primary ${
                        pathname.split("/").includes("flashcard")
                          ? "text-primary"
                          : "text-slate-500"
                      } border-b-0 hover:bg-slate-200 rounded-md`}
                    >
                      <GiCardExchange className="text-2xl" />
                    </div>
                  </Link>
                  {pathname.split("/").includes("flashcard") ? (
                    <div className="w-full border-b-4 border-primary"></div>
                  ) : (
                    ""
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Flashcard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link href="/friends">
                    <div
                      className={`flex justify-center h-full px-4 py-2 border-primary ${
                        pathname.split("/").includes("friends")
                          ? "text-primary"
                          : "text-slate-500"
                      } border-b-0 hover:bg-slate-200 rounded-md`}
                    >
                      <FaUserFriends className="text-2xl" />
                    </div>
                  </Link>
                  {pathname.split("/").includes("friends") ? (
                    <div className="w-full border-b-4 border-primary"></div>
                  ) : (
                    ""
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bạn bè</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link href="/schedule">
                    <div
                      className={`flex justify-center h-full px-4 py-2 border-primary ${
                        pathname === "/schedule"
                          ? "text-primary"
                          : "text-slate-500"
                      } border-b-0 hover:bg-slate-200 rounded-md`}
                    >
                      <GrSchedules className="text-2xl" />
                    </div>
                  </Link>
                  {pathname === "/schedule" ? (
                    <div className="w-full border-b-4 border-primary"></div>
                  ) : (
                    ""
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Thời khóa biểu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex gap-6 py-2 basis-1/4 justify-end items-center">
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="relative flex items-center h-full">
                  <RiBookFill className="text-2xl text-slate-500 hover:text-primary transition duration-300 cursor-pointer" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[60vh] overflow-y-auto">
                <Dictionary />
              </DialogContent>
            </Dialog>
          </div>
          <div className="h-full flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative flex items-center h-full">
                  <IoNotifications className="text-2xl text-slate-500 hover:text-primary transition duration-300 cursor-pointer" />
                  {notifications?.length > 0 &&
                    notifications.find((item: any) => !item?.isViewed) && (
                      <span className="w-[10px] absolute right-0 top-[5px] h-[10px] rounded-full bg-red-500" />
                    )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="mt-[14px] space-y-2 max-h-[400px] overflow-y-auto">
                {notifications.length === 0 && (
                  <div className="text-sm">Không có thông báo</div>
                )}
                {notifications.map((notification, index) => {
                  if (index === notifications?.length - 1)
                    return (
                      <div key={notification._id}>
                        <li ref={elRef} className="w-full flex justify-center">
                          <Notification notification={notification} />
                        </li>
                        {isLoading ? (
                          <div className="w-full my-4 justify-center items-center flex gap-2 shadow-md bg-background py-2 rounded-md">
                            <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />{" "}
                            Đang tải thông báo mới
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  else
                    return (
                      <li
                        key={notification._id}
                        className="w-full flex justify-center"
                      >
                        <Notification
                          notification={notification}
                          notis={notifications}
                          setNotis={setNotifications}
                        />
                      </li>
                    );
                })}
              </PopoverContent>
            </Popover>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage
                  className="cursor-pointer"
                  src={user.avatar}
                  alt="@shadcn"
                />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link
                    className="flex w-full items-center"
                    href={`/profile/${user._id}`}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Thông tin cá nhân</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <ChangePasswordDialog />
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
                        <Image
                          className="mr-2 h-4 w-6"
                          height={0}
                          width={0}
                          alt="Vietnam flag"
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAABPCAMAAADmzqp4AAAAY1BMVEXaJR3//wDYAB754gnZHh3WAB/ZFB7kdxjjchj65wnYCx7++AT21QzxvxDcNxznhxbmghflfhf0zg3bLx3zyA776wfdRRvqmRTusBLgXxreTxvtqRP88AbsoxPfVBvrnxTojhZLYPKuAAABlUlEQVRoge2Y3XKCMBBGzZoESAB/EBER8P2fspgKVEHrdNhNL/Z44wwzHvnY5IuuVgzDMAzD/AXpR6tr7UMrU5H6uGO9ERsfNwyxiMGD1wghDL1Wbzvvlj7oLmbhJWhxg9yqd867ow4a9s67pw46s85rM1qtDsQ3AW3QcLh7D7RBg+gh9cpw8IaY3SDhEZUM3kQ9XVvwe8gqXz8iRp6u5NWCYriKT7ku+sDNMfrIGh0XrigJpw+0pyWf7h0I7S9WG6IsKp3Fb7VxhrV3qeKNtlB4Kxma/IU1b1A3LqmTWW2isY+0EEzHy+4IdmkIJ16cOX72ThfyicJrLhPvheAcLcuZsSrxfyjN7pcEQeu5gojQg5bn0bYf356xgzbVsGhDNTZFhX3Dqp/meKW7V98UF4WrHWIuXNNKKGiCNrWzjC3QN0WNGzS4af7ZAvemiHDrqLk5gkcHuN8sDWbQpu0GanJ0M8duvFrMoM1a1DNHNwmtWCN65dmW888RSos40bJMXx3ddIrZDe8+2tO/lQzDMAzDMP+ML8rKDZb3zOkjAAAAAElFTkSuQmCC"
                        />
                        <span>Tiếng Việt</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeLang("en")}>
                        <Image
                          className="mr-2 h-4 w-6"
                          height={0}
                          width={0}
                          alt="UN flag"
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Great_Britain_%281707%E2%80%931800%29.svg/255px-Flag_of_Great_Britain_%281707%E2%80%931800%29.svg.png"
                        />
                        <span>Tiếng Anh</span>
                      </DropdownMenuItem>
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
  );
}
