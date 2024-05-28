"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux/store";
import { ChatService, TopicService, UserService } from "@/app/services";
import createAxiosInstance from "@/app/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import CreatePost from "../../(homepage)/components/createpost";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Post } from "@/components/posts/post";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { IoMdPersonAdd } from "react-icons/io";
import { addDays, format } from "date-fns";
import { FaCamera, FaHeart, FaSave } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { vi } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocketStore } from "@/app/store/socketStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { uploadFile } from "@/utils";
import { changeAvatar } from "@/app/redux/slices/authSlice";
import { TiUserDelete } from "react-icons/ti";

const Profile = ({ params }: { params: any }) => {
  const current_user = useAppSelector((state) => state.auth.userinfor);
  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ["profile", params.id],
    queryFn: async () => {
      const res = await UserService.getUserById(params.id);
      return res.data;
    },
  });
  // Xử lý post

  const [posts, setPosts] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("all");

  const createpost = (post: any) => {
    setPosts((prev: any) => [post, ...prev]);
  };
  const axiosJWT = createAxiosInstance();
  const { data: friends, refetch: refetchFriends } = useQuery({
    queryKey: ["friends", params?.id],
    queryFn: async () => {
      if (params.id) {
        const friends = await UserService.getFriends(params.id);
        const search = friends.data.find(
          (friend: any) => friend._id === current_user._id
        );
        if (search) setIsFriend(true);
        else setIsFriend(false);
        return friends.data;
      }
    },
  });

  const [isFriend, setIsFriend] = useState<boolean>(false);

  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const { refetch, isLoading } = useQuery({
    queryKey: ["posts", selectedTopic],
    queryFn: async () => {
      let lastTime = null;
      if (posts && posts.length > 0) {
        lastTime = posts[posts.length - 1].data.createdAt;
      }
      const newData = await axiosJWT.get(
        `${process.env.NEXT_PUBLIC_BASE_URL_V2}/posts/page`,
        {
          params: {
            author: params.id,
            lastPostTime: lastTime,
            pageSize: 5,
            ...(selectedTopic !== "all" && { topic: selectedTopic }),
          },
        }
      );
      if (posts.length > 20 && newData.data.length > 0) {
        setPosts(() => {
          const updatedPosts = [...newData.data];
          return updatedPosts;
        });
      } else
        setPosts((prevData: any) => {
          const updatedPosts = [...prevData, ...newData.data];
          return updatedPosts;
        });
      return newData.data;
    },
  });

  const { data: allTopics } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const topics = await TopicService.getAll();
      return topics?.data ?? [];
    },
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        setPosts([]);
      }

      await Promise.all([setPostsPromise]);
      refetch();
    };

    const setPostsPromise = new Promise((resolve) => {
      setPosts([]);
      resolve({});
    });

    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [selectedTopic]);

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
    [posts]
  );

  const deleteByPostId = async (id: any) => {
    const newpost = posts.filter((item: any) => item.data._id !== id);
    setPosts(newpost);
  };

  const [isOpenTarget, setIsOpenTarget] = useState<boolean>(false);
  const [target, setTarget] = useState<string>(user?.target?.description ?? "");
  const [targetDateRange, setTargetDateRange] = useState<DateRange | undefined>(
    {
      from: user?.target?.startDate
        ? new Date(user?.target?.startDate)
        : new Date(),
      to: user?.target?.targetDate
        ? new Date(user?.target?.targetDate)
        : addDays(new Date(), 10),
    }
  );

  const handleChangeTarget = async () => {
    if (targetDateRange?.from && targetDateRange?.to) {
      const response = await UserService.setTarget(
        target,
        targetDateRange?.from,
        targetDateRange?.to
      );
      toast.success("Đổi mục tiêu thành công");
      setIsOpenTarget(false);
      refetchUser();
    }
  };

  const { socket: sk } = useSocketStore();

  const inputFileRef = useRef<any>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar);

  const handleAvatarClick = () => {
    inputFileRef.current.click(); // Khi avatar được click, gọi click() của input file
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    setAvatarPreview(user?.avatar);
  }, [user]);

  const handleChangeAvatar = async () => {
    const newAvt = await uploadFile(avatarPreview);
    const response = await UserService.changeAvt(newAvt);
    dispatch(changeAvatar(newAvt));
    toast.success("Đổi avatar thành công");
  };

  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const handleDeleteFriend = async () => {
    await UserService.deleteFriend(params.id);
    toast.success("Hủy kết bạn thành công");
    setIsFriend(true);
    setOpenConfirm(false);
    refetchFriends();
    refetchRequests();
  };

  const [isRequest, setIsRequest] = useState<boolean>(false);

  const { refetch: refetchRequests } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const requests = await ChatService.getMyListRequest();
      const find = requests.find(
        (item: any) => item.receiver._id === params.id
      );
      if (find) setIsRequest(true);
      else setIsRequest(false);
    },
  });

  const { refetch: refetchFriendRequests } = useQuery({
    queryKey: ["friendrequests"],
    queryFn: async () => {
      const requests = await ChatService.getListRequest();
      const find = requests.find(
        (item: any) =>
          item.receiver === current_user._id && item.sender._id === params.id
      );
      if (find) setIsWaiting(true);
      else setIsWaiting(false);
    },
  });

  const handleRequestFriend = async (request: {
    type: string;
    request: string;
    receiver: string;
    sender: string;
  }) => {
    sk?.emit("request-add-friend", {
      type: request.type,
      request: request.request,
      receiver: request.receiver,
    });
    if (request.type === "ADD") {
      toast("Bạn đã gửi yêu cầu kết bạn đến " + request.sender);
      setIsRequest(true);
    } else if (request.type === "DENY") {
      toast("Bạn đã từ chối yêu cầu kết bạn từ " + request.sender);
    } else if (request.type === "ACCEPT") {
      toast("Bạn đã đồng ý yêu cầu kết bạn từ " + request.sender);
    }
  };
  return (
    <div className="">
      <div className="w-full bg-white rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between container">
          <div className="flex gap-8 items-center">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                ref={inputFileRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                onClick={handleAvatarClick}
                className="group rounded-full aspect-square relative max-w-32 max-h-32 h-32 w-32 border-white border-2"
              >
                <Image
                  className="w-32 h-32 rounded-full object-contain border border-slate-200"
                  width={0}
                  height={0}
                  src={avatarPreview}
                  alt="avatar"
                />
                <div className="group-hover:opacity-25 opacity-0 transition-all absolute bg-black rounded-full inset-0 z-1" />
                <FaCamera className="z-2 group-hover:opacity-100 opacity-0 transition-all duration-300 text-4xl text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </button>
            </div>
            <div>
              <div className="font-bold text-2xl">{user?.name}</div>
              <Dialog>
                <DialogTrigger>
                  <div className="text-slate-600 text-sm mt-2">
                    {friends && friends.length} bạn bè
                  </div>
                </DialogTrigger>
                <DialogContent className="max-h-[60vh] overflow-y-auto space-y-2">
                  <div className="mb-2 font-bold">Danh sách bạn bè</div>
                  {friends &&
                    friends.map((friend: any) => (
                      <Link
                        className="flex items-center font-semibold gap-4 hover:bg-secondary transition-all duration-300 p-2 rounded-md w-full"
                        key={friend._id}
                        href={`/profile/${friend._id}`}
                      >
                        <Avatar>
                          <AvatarImage
                            className="cursor-pointer"
                            src={friend.avatar}
                            alt="@shadcn"
                          />
                          <AvatarFallback>{friend.name}</AvatarFallback>
                        </Avatar>
                        {friend.name}
                      </Link>
                    ))}
                </DialogContent>
              </Dialog>
              <div className="flex space-x-[-10px] mt-2">
                {friends &&
                  friends.slice(0, 7).map((friend: any) => (
                    <TooltipProvider key={friend._id}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Link href={`/profile/${friend._id}`}>
                            <Avatar>
                              <AvatarImage
                                className="cursor-pointer"
                                src={friend.avatar}
                                alt="@shadcn"
                              />
                              <AvatarFallback>{friend.name}</AvatarFallback>
                            </Avatar>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div>
                            <Link
                              className="flex items-center gap-2"
                              href={`/profile/${friend._id}`}
                            >
                              <Avatar key={friend._id}>
                                <AvatarImage
                                  className="cursor-pointer"
                                  src={friend.avatar}
                                  alt="@shadcn"
                                />
                                <AvatarFallback>{friend.name}</AvatarFallback>
                              </Avatar>
                              <p className="font-bold">{friend.name}</p>
                            </Link>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
              </div>
            </div>
          </div>
          <div>
            {params.id !== current_user._id &&
            !isFriend &&
            !isRequest &&
            !isWaiting ? (
              <Button
                onClick={() =>
                  handleRequestFriend({
                    type: "ADD",
                    receiver: params.id.toString(),
                    request: "",
                    sender: user.name,
                  })
                }
                className="flex items-center gap-1"
              >
                <IoMdPersonAdd />
                Thêm bạn bè
              </Button>
            ) : (
              params.id !== current_user._id &&
              isRequest && (
                <Button variant="secondary" className="flex items-center gap-1">
                  Chờ phản hồi
                </Button>
              )
            )}
            {params.id !== current_user._id && isWaiting && (
              <div className="space-y-2 mt-4 flex flex-col p-2">
                <Button variant="secondary">Chờ bạn phản hồi</Button>
              </div>
            )}
            {avatarPreview !== current_user?.avatar &&
              params.id === current_user._id && (
                <Button
                  onClick={handleChangeAvatar}
                  className="flex gap-2 items-center"
                >
                  <FaSave /> Lưu
                </Button>
              )}
            {isFriend && params.id !== current_user._id && (
              <Button
                onClick={() => setOpenConfirm(true)}
                variant={"secondary"}
                className="flex gap-2 items-center"
              >
                <TiUserDelete /> Hủy kết bạn
              </Button>
            )}
            <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
              <DialogContent>
                Bạn có chắc chắn muốn hủy kết bạn ?
                <DialogFooter className="flex gap-2 justify-end">
                  <Button variant="secondary">Hủy</Button>
                  <Button onClick={handleDeleteFriend}>Xác nhận</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="flex gap-8 container mt-4">
        <div className="basis-2/5">
          <div className="rounded-md bg-background shadow-md pt-2 pb-6 px-6 flex flex-col gap-2">
            <div className="font-medium flex items-center gap-2">
              <div className="relative w-fit">
                <span className="p-1 animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <FaHeart className="text-pink-500 text-sm" />
              </div>
              Bảng mục tiêu
              <div className="">
                {params.id === current_user._id && (
                  <button
                    onClick={() => setIsOpenTarget(true)}
                    className="transition-all duration-300 hover:scale-[1.1]"
                  >
                    <MdEdit />
                  </button>
                )}
              </div>
              <Dialog open={isOpenTarget} onOpenChange={setIsOpenTarget}>
                <DialogContent>
                  <div className="space-y-2 mt-4">
                    <div className="font-bold">Mục tiêu</div>
                    <Textarea
                      value={target}
                      onChange={(event: any) => setTarget(event.target.value)}
                      placeholder="Nhập mục tiêu của bạn"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="font-bold">Ngày bắt đầu - kết thúc</div>
                    <div className={"grid gap-2"}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-[300px] justify-start text-left font-normal",
                              !targetDateRange && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {targetDateRange?.from ? (
                              targetDateRange.to ? (
                                <>
                                  {format(targetDateRange.from, "LLL dd, y", {
                                    locale: vi,
                                  })}{" "}
                                  -{" "}
                                  {format(targetDateRange.to, "LLL dd, y", {
                                    locale: vi,
                                  })}
                                </>
                              ) : (
                                format(targetDateRange.from, "LLL dd, y", {
                                  locale: vi,
                                })
                              )
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={targetDateRange?.from}
                            selected={targetDateRange}
                            onSelect={setTargetDateRange}
                            numberOfMonths={2}
                            locale={vi}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="w-full flex justify-end mt-4">
                      <Button onClick={handleChangeTarget}>Lưu</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-2 space-y-2">
              <div>
                <span className="font-semibold text-sm">Ngày bắt đầu: </span>
                <span>
                  {user &&
                    user.target &&
                    user.target.startDate &&
                    format(new Date(user.target.startDate), "dd/MM/yyyy")}
                </span>
              </div>
              <div>
                <span className="font-semibold text-sm">Ngày kết thúc: </span>
                <span>
                  {user &&
                    user.target &&
                    user.target.targetDate &&
                    format(new Date(user.target.targetDate), "dd/MM/yyyy")}
                </span>
              </div>
              <div className="text-sm">{user?.target?.description}</div>
            </div>
          </div>
        </div>
        <div className="basis-3/5">
          <div className="infinite-scroll-container w-full">
            {current_user._id === params.id && <CreatePost add={createpost} />}
            <div
              className={`flex justify-between my-1 ${
                current_user._id === params.id && "mt-4"
              }`}
            >
              <Select onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Chọn chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Loại bài viết</SelectLabel>
                    <SelectItem value={"all"} key={0}>
                      Tất cả
                    </SelectItem>
                    {allTopics?.map((item: any) => (
                      <SelectItem value={item._id} key={item._id}>
                        {item.topicName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <ul className="w-full flex flex-col gap-4 mt-4">
              {posts.map((post, index) => {
                if (index === posts.length - 1)
                  return (
                    <div key={index}>
                      <li ref={elRef} className="w-full flex justify-center">
                        <Post data={post} deletepost={deleteByPostId} />
                      </li>
                      {isLoading ? (
                        <div className="w-full my-4 justify-center items-center flex gap-2 shadow-md bg-background py-2 rounded-md">
                          <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />{" "}
                          Đang tải bài viết mới
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                else
                  return (
                    <li key={index} className="w-full flex justify-center">
                      <Post data={post} deletepost={deleteByPostId} />
                    </li>
                  );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
