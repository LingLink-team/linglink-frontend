"use client";
import { ChatLayout } from "@/components/chat/chat-layout";
import { Button } from "@/components/ui/button";
import chat from "@/app/assets/images/chat.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Request, Room, User, roomsData } from "@/app/constants/data";
import { ChatService } from "@/app/services";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getSocket } from "@/app/services/socketService";
import { useAppSelector } from "@/app/redux/store";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Chat() {
  const [openFriend, setOpenFriend] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(roomsData[0]);
  const [rooms, setRooms] = useState(roomsData);
  const handleChooseFriend = (room: Room) => {
    // Xử lý chọn user để chat ở đây
    setSelectedRoom(room);
    setOpenFriend(false);
  };

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<Request[]>([
    {
      _id: "",
      sender: { _id: "", email: "", name: "", avatar: "" },
      receiver: { _id: "", email: "", name: "", avatar: "" },
      status: "",
    },
  ]);

  const handleSearch = async () => {
    const result = await ChatService.searchFriendsByName(search);
    setSearchResult(result);
    setIsSearchOpen(true);
  };

  const user = useAppSelector((state) => state.auth.userinfor);
  const sk = getSocket();
  const handleRequestFriend = async (request: {
    type: string;
    request: string;
    receiver: string;
    sender: string;
  }) => {
    sk.emit("request-add-friend", {
      type: request.type,
      request: request.request,
      receiver: request.receiver,
    });
    if (request.type === "ADD") {
      toast("Bạn đã gửi yêu cầu kết bạn đến " + request.sender);
      setSearchResult([]);
    } else if (request.type === "DENY") {
      toast("Bạn đã từ chối yêu cầu kết bạn từ " + request.sender);
      setFriendRequests((prevRequests) =>
        prevRequests.filter((req) => req._id.toString() !== request.request)
      );
    } else if (request.type === "ACCEPT") {
      toast("Bạn đã đồng ý yêu cầu kết bạn từ " + request.sender);
      setFriendRequests((prevRequests) =>
        prevRequests.filter((req) => req._id.toString() !== request.request)
      );
    }
  };
  // Lấy danh sách room chat
  async function fetchChatRoom() {
    const roomchats = await ChatService.getChatRoom();
    setRooms(roomchats);
    return roomchats;
  }

  async function setChatRoom() {
    const roomchats: any = await fetchChatRoom();
    if (sk) {
      roomchats.forEach((element: Room) => {
        sk.emit("join-room", { chatRoomID: element.chatRoomId });
      });
      sk.on("request", (request) => {
        if (request.receiver === user._id.toString()) {
          if (request.type === "ADD") {
            setFriendRequests((prevRequests) => [
              ...prevRequests,
              request.request,
            ]);
          } else if (request.type === "NOTI") toast(request.content);
        }
      });
      sk.on("notification", (noti) => {
        toast(noti.sender + noti.content);
        fetchChatRoom();
      });
      sk.on("accept_status", (noti) => {
        fetchChatRoom();
      });
    }
  }
  async function getFriendRequests() {
    const requests = await ChatService.getListRequest();
    setFriendRequests(requests);
  }

  useEffect(() => {
    getFriendRequests();
    setChatRoom();
  }, [sk]);
  const [chatOpen, setChatOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <Popover open={chatOpen} onOpenChange={setChatOpen}>
      <PopoverTrigger asChild>
        <Button
          className={`fixed bottom-6 right-4 rounded-full w-14 h-14 ${
            chatOpen ? "invisible" : ""
          }`}
          variant="outline"
        >
          <Image
            className="h-8 w-8 drop-shadow-lg object-contain"
            src={chat}
            alt="chat"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="scroll-auto max-h-80vh max-w-[320px] w-[320px] fixed bottom-2 right-2">
        <div className="gap-4 py-4 h-full scroll-y-auto">
          {!openFriend && (
            <IoMdArrowRoundBack
              className="text-xl mb-6 cursor-pointer"
              onClick={() => setOpenFriend(true)}
            />
          )}
          {openFriend && (
            <div className="relative group flex flex-col gap-4 p-2 data-[collapsed=true]:p-2 overflow-auto max-h-[500px] no-scrollbar">
              <div className="w-full flex gap-4 items-center">
                <Input
                  type="text"
                  value={search}
                  onChange={(e: any) => setSearch(e.target.value)}
                  placeholder="Nhập tên để tìm kiếm"
                />
                <Button className="" onClick={handleSearch}>
                  Tìm kiếm
                </Button>
              </div>
              {searchResult.length > 0 && (
                <Collapsible
                  open={isSearchOpen}
                  onOpenChange={setIsSearchOpen}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between space-x-4">
                    <h4 className="font-medium">Kết quả tìm kiếm</h4>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="space-y-2">
                    {searchResult?.map((item: User) => (
                      <div
                        className="bg-gray-100 p-2 w-full rounded-lg flex gap-x-4"
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
                        <div className="flex flex-col w-full">
                          <span>{item.name}</span>
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
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
              {friendRequests.length > 0 && (
                <div className="relative group flex flex-col gap-4 p-2 data-[collapsed=true]:p-2 ">
                  {/* ...existing code... */}
                  {friendRequests.map((request) => (
                    <div
                      key={request._id}
                      className="bg-gray-100 p-2 w-full rounded-lg flex gap-x-4"
                    >
                      <Avatar className="flex justify-center items-center">
                        <AvatarImage
                          src={request.sender.avatar}
                          alt={request.sender.name}
                          width={8}
                          height={8}
                          className="h-fit w-fit max-w-12 max-h-12 rounded-full"
                        />
                      </Avatar>
                      <div className="flex flex-col justify-center">
                        <p>{request.sender.name}</p>
                        <div className="flex gap-x-2">
                          <button
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
                          </button>
                          <button
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
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <nav className="grid gap-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2 w-full">
                <h2 className="font-medium">Danh sách bạn bè</h2>
                {rooms.map((room, index) => (
                  <div
                    onClick={() => handleChooseFriend(room)}
                    key={index}
                    className="bg-gray-100 p-2 w-full rounded-lg cursor-pointer flex gap-x-4"
                  >
                    <Avatar className="flex justify-center items-center">
                      <AvatarImage
                        src={room.friends.avatar}
                        alt={room.friends.avatar}
                        width={8}
                        height={8}
                        className="h-fit w-fit max-w-12 max-h-12 rounded-full"
                      />
                    </Avatar>
                    <div className="flex flex-col w-full">
                      <span>{room.friends.name}</span>
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          )}
          <div className="z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex">
            {!openFriend && (
              <ChatLayout
                chatRoomId={selectedRoom.chatRoomId}
                name={selectedRoom.name}
                participant={selectedRoom.participant}
                friends={selectedRoom.friends}
              />
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
