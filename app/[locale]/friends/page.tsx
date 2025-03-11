"use client";

import { User } from "@/app/constants/data";
import { useAppSelector } from "@/app/redux/store";
import { ChatService, UserService } from "@/app/services";
import { useSocketStore } from "@/app/store/socketStore";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoPeopleSharp, IoPersonAdd } from "react-icons/io5";
import { RiSearchLine } from "react-icons/ri";
import { toast } from "sonner";

const Friends: React.FC = () => {
  const user = useAppSelector((state) => state.auth.userinfor);
  const { data: friends, refetch } = useQuery({
    queryKey: ["friends", user?._id],
    queryFn: async () => {
      if (user._id) {
        const friends = await UserService.getFriends(user._id);
        return friends.data;
      }
    },
  });

  const { data: friendRequests, refetch: refetchRequests } = useQuery({
    queryKey: ["friendRequests", user?._id],
    queryFn: async () => {
      if (user._id) {
        const requests = await ChatService.getListRequest();
        return requests;
      }
    },
  });

  const { data: MyFriendRequests, refetch: refetchMyRequests } = useQuery({
    queryKey: ["MyFriendRequests", user?._id],
    queryFn: async () => {
      if (user._id) {
        const requests = await ChatService.getMyListRequest();
        return requests;
      }
    },
  });

  const { socket: sk } = useSocketStore();
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
      toast.success("Bạn đã gửi yêu cầu kết bạn đến " + request.sender);
      if (searchResult.length > 0) {
        const newResult = searchResult.filter(
          (item: User) => item._id.toString() !== request.receiver
        );
        setSearchResult(newResult);
      }
    } else if (request.type === "DENY") {
      toast.error("Bạn đã từ chối yêu cầu kết bạn từ " + request.sender);
    } else if (request.type === "ACCEPT") {
      toast.success("Bạn đã đồng ý yêu cầu kết bạn từ " + request.sender);
    }
    setTimeout(refetchRequests, 1000);
  };

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>([]);

  const handleSearch = async () => {
    const result = await ChatService.searchFriendsByName(search);
    setSearchResult(result);
  };

  const [clickedMenu, setClickedMenu] = useState<string>("all");
  const handleClick = (menu: string) => {
    setClickedMenu(menu);
    refetch();
    refetchMyRequests();
    refetchRequests();
  };
  const active_menu = "border-b-2 border-b-primary text-primary";
  const deleteRequest = async (id: string) => {
    const results = await ChatService.deleteRequest(id);
    toast.success("Hủy yêu cầu kết bạn thành công");
    refetchMyRequests();
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-center gap-4 mb-8">
        <Button
          onClick={() => handleClick("all")}
          variant="ghost"
          className={`flex items-center gap-2 p-2 ${
            clickedMenu === "all" && active_menu
          }`}
        >
          <IoPeopleSharp className="text-xl" />
          <span className="text-lg font-semibold">Tất cả bạn bè</span>
        </Button>
        <Button
          onClick={() => handleClick("request")}
          variant="ghost"
          className={`flex items-center gap-2 p-2 ${
            clickedMenu === "request" && active_menu
          }`}
        >
          <IoPersonAdd className="text-xl" />
          <span className="text-lg font-semibold">Lời mời kết bạn</span>
        </Button>
        <Button
          onClick={() => handleClick("search")}
          variant="ghost"
          className={`flex items-center gap-2 p-2 ${
            clickedMenu === "search" && active_menu
          }`}
        >
          <RiSearchLine className="text-xl" />
          <span className="text-lg font-semibold">Tìm bạn</span>
        </Button>
      </div>
      <div className="bg-white shadow-md p-6 rounded-md">
        {clickedMenu === "all" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {friends &&
              friends.map((friend: any) => (
                <Link
                  key={friend._id}
                  href={`/profile/${friend._id}`}
                  className="bg-gray-100 hover:bg-gray-200 transition rounded-md p-4 flex flex-col items-center"
                >
                  <Image
                    className="w-24 h-24 rounded-full mb-4 object-cover"
                    height={96}
                    width={96}
                    src={friend.avatar}
                    alt="avatar"
                  />
                  <span className="font-medium text-center">{friend.name}</span>
                </Link>
              ))}
          </div>
        )}
        {clickedMenu === "request" && (
          <div>
            <Dialog>
              <DialogTrigger>
                <Button className="font-medium">Xem lời mời đã gửi</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[60vh] overflow-y-auto">
                <div className="font-semibold mb-2">Lời mời đã gửi</div>
                {MyFriendRequests?.map((request: any) => (
                  <div
                    key={request._id}
                    className="bg-gray-100 p-4 rounded-md flex justify-between items-center mb-2"
                  >
                    <Link
                      href={`/profile/${request.receiver._id}`}
                      className="flex items-center gap-4"
                    >
                      <Image
                        className="w-12 h-12 rounded-full"
                        height={48}
                        width={48}
                        src={request.receiver.avatar}
                        alt="avatar"
                      />
                      <span className="font-medium">
                        {request.receiver.name}
                      </span>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={() => deleteRequest(request._id)}
                    >
                      Hủy
                    </Button>
                  </div>
                ))}
              </DialogContent>
            </Dialog>
            <div className="font-semibold text-lg mb-4 mt-6">
              Lời mời đã nhận
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {friendRequests?.map((request: any) => (
                <div
                  key={request._id}
                  className="bg-gray-100 hover:bg-gray-200 transition p-4 rounded-md flex flex-col items-center"
                >
                  <Link
                    href={`/profile/${request.sender._id}`}
                    className="flex flex-col items-center"
                  >
                    <Image
                      className="w-24 h-24 rounded-full mb-4 object-cover"
                      height={96}
                      width={96}
                      src={request.sender.avatar}
                      alt="avatar"
                    />
                    <span className="font-medium">{request.sender.name}</span>
                  </Link>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() =>
                        handleRequestFriend({
                          type: "ACCEPT",
                          request: request._id.toString(),
                          receiver: request.sender._id.toString(),
                          sender: request.sender.name,
                        })
                      }
                    >
                      Đồng ý
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleRequestFriend({
                          type: "DENY",
                          request: request._id.toString(),
                          receiver: request.sender._id.toString(),
                          sender: request.sender.name,
                        })
                      }
                    >
                      Từ chối
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {clickedMenu === "search" && (
          <div>
            <div className="flex gap-4 items-center bg-gray-50 mb-4">
              <Input
                className="flex-1"
                type="text"
                value={search}
                onChange={(e: any) => setSearch(e.target.value)}
                placeholder="Nhập tên để tìm kiếm"
              />
              <Button className="bg-primary text-white" onClick={handleSearch}>
                <RiSearchLine className="h-5 w-5" />
              </Button>
            </div>
            <hr className="mb-4" />
            {searchResult.length > 0 && (
              <div>
                <div className="font-semibold mb-4">Kết quả tìm kiếm:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResult.map((item: User) => (
                    <div
                      key={item._id}
                      className="bg-gray-100 hover:bg-gray-200 transition p-4 rounded-md flex flex-col items-center"
                    >
                      <Link href={`/profile/${item._id}`}>
                        <Avatar className="w-24 h-24 rounded-full mb-4">
                          <AvatarImage
                            src={item.avatar}
                            alt={item.avatar}
                            width={96}
                            height={96}
                          />
                        </Avatar>
                      </Link>
                      <span className="font-medium">{item.name}</span>
                      {friends?.some(
                        (friend: any) => friend._id === item._id
                      ) ? (
                        <span className="text-sm text-gray-500 mt-2">
                          Đã là bạn bè
                        </span>
                      ) : !friendRequests.some(
                          (request: any) => request.sender._id === item._id
                        ) ? (
                        <Button
                          className="mt-2"
                          onClick={() =>
                            handleRequestFriend({
                              type: "ADD",
                              receiver: item._id.toString(),
                              request: "",
                              sender: item.name,
                            })
                          }
                        >
                          Gửi kết bạn
                        </Button>
                      ) : (
                        <span className="text-sm text-gray-500 mt-2">
                          Chờ bạn phản hồi
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
