"use client";

import { User } from "@/app/constants/data";
import { useAppSelector } from "@/app/redux/store";
import { ChatService, UserService } from "@/app/services";
import { useSocketStore } from "@/app/store/socketStore";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  const { data: friends } = useQuery({
    queryKey: ["friends", user?._id],
    queryFn: async () => {
      if (user._id) {
        const friends = await UserService.getFriends(user._id);
        console.log("Frinds", friends);
        return friends.data;
      }
    },
  });

  const { data: friendRequests, refetch: refetchRequests } = useQuery({
    queryKey: ["friendRequests", user?._id],
    queryFn: async () => {
      if (user._id) {
        const requests = await ChatService.getListRequest();
        console.log(requests);
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
      toast("Bạn đã gửi yêu cầu kết bạn đến " + request.sender);
    } else if (request.type === "DENY") {
      toast("Bạn đã từ chối yêu cầu kết bạn từ " + request.sender);
    } else if (request.type === "ACCEPT") {
      toast("Bạn đã đồng ý yêu cầu kết bạn từ " + request.sender);
    }
    refetchRequests();
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
  };
  return (
    <div className="container">
      <div className="bg-background mt-8 rounded-md px-2 py-4">
        <Button
          onClick={() => handleClick("all")}
          variant="ghost"
          className="!py-2 h-full"
        >
          <div className="flex items-center gap-2 h-full">
            <div className="rounded-full w-10 h-10 bg-slate-400 flex items-center justify-center p-2">
              <IoPeopleSharp className="text-black" />
            </div>
            <div className="font-medium text-lg">Tất cả bạn bè</div>
          </div>
        </Button>
        <Button
          onClick={() => handleClick("request")}
          variant="ghost"
          className="!py-2 h-full"
        >
          <div className="flex items-center gap-2 h-full">
            <div className="rounded-full w-10 h-10 bg-slate-400 flex items-center justify-center p-2">
              <IoPersonAdd className="text-black" />
            </div>
            <div className="font-medium text-lg">Lời mời kết bạn</div>
          </div>
        </Button>
        <Button
          onClick={() => handleClick("search")}
          variant="ghost"
          className="!py-2 h-full"
        >
          <div className="flex items-center gap-2 h-full">
            <div className="rounded-full w-10 h-10 bg-slate-400 flex items-center justify-center p-2">
              <IoPersonAdd className="text-black" />
            </div>
            <div className="font-medium text-lg">Tìm bạn</div>
          </div>
        </Button>
      </div>
      <div>
        {clickedMenu === "all" && (
          <div className="grid grid-cols-6 mt-8">
            {friends &&
              friends.map((friend: any) => (
                <div key={friend._id} className="bg-white rounded-md shadow-md">
                  <Link href={`/profile/${friend._id}`}>
                    <Image
                      className="w-full mb-2 object-contain rounded-t-md"
                      height={0}
                      width={0}
                      src={friend.avatar}
                      alt="avatar"
                    />
                    <div className="font-medium px-2 pt-2 pb-4">
                      {friend.name}
                    </div>
                  </Link>
                  {/* <Button>Đồng ý</Button> */}
                </div>
              ))}
          </div>
        )}
        {clickedMenu === "request" && (
          <div className="grid grid-cols-6 mt-8">
            {friendRequests?.map((request: any) => (
              <div
                key={request._id}
                className="bg-background p-2 w-full rounded-lg space-y-2"
              >
                <div className="flex flex-col gap-y-4">
                  <Link href={`/profile/${request.sender._id}`}>
                    <Image
                      className="w-full mb-2 object-contain rounded-t-md"
                      height={0}
                      width={0}
                      src={request.sender.avatar}
                      alt="avatar"
                    />
                    <div className="font-medium px-2 pt-2 pb-4">
                      {request.sender.name}
                    </div>
                  </Link>
                </div>
                <div className="space-y-2 mt-4 flex flex-col">
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
                    variant="secondary"
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
        )}
        {clickedMenu === "search" && (
          <div>
            <div className="w-full flex gap-4 items-center mt-2">
              <Input
                className="max-w-[400px]"
                type="text"
                value={search}
                onChange={(e: any) => setSearch(e.target.value)}
                placeholder="Nhập tên để tìm kiếm"
              />
              <button
                className="bg-primary rounded-md p-[10px] text-white"
                onClick={handleSearch}
              >
                <RiSearchLine className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grids-col-6 gap-4 mt-2">
              {searchResult.length > 0 &&
                searchResult?.map((item: User) => (
                  <div
                    className="bg-background p-2 rounded-lg flex gap-x-4"
                    key={item._id}
                  >
                    <Avatar className="flex justify-center items-center">
                      <AvatarImage
                        src={item.avatar}
                        alt={item.avatar}
                        width={8}
                        height={8}
                        className="h-fit w-fit max-w-12 max-h-12 rounded-full"
                      />
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      {friends.some(
                        (friend: any) => friend._id === item._id
                      ) ? (
                        <div> Đã là bạn bè </div>
                      ) : (
                        <>
                          {!friendRequests.some(
                            (friend: any) => friend.sender._id === item._id
                          ) ? (
                            <button
                              className="text-left text-sm mt-2 text-primary"
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
                            </button>
                          ) : (
                            <div> Chờ bạn phản hồi</div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
