"use client";
import { ChatLayout } from "@/components/chat/chat-layout";
import { Button } from "@/components/ui/button";
import chat from "@/app/assets/images/chat.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Room, User, roomsData } from "@/app/constants/data";
import { ChatService } from "@/app/services";
import { useAppSelector } from "@/app/redux/store";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RiSearchLine } from "react-icons/ri";
import { useSocketStore } from "@/app/store/socketStore";
import { connectSocket, disconnectSocket } from "@/app/services/socketService";
import { AvatarFallback, Avatar, AvatarImage } from "@/components/ui/avatar";

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
  const [searchResult, setSearchResult] = useState<any>([]);

  const handleSearch = async () => {
    const result = rooms.filter((room: any) => room.friends?.name.includes(search))
    setSearchResult(result)
  };

  const user = useAppSelector((state) => state.auth.userinfor);
  const { socket: sk, setSocket } = useSocketStore();
 
  // Lấy danh sách room chat
  async function fetchChatRoom() {
    const roomchats = await ChatService.getChatRoom();
    setRooms(roomchats);
    setSearchResult(roomchats)
    return roomchats;
  }

  async function setChatRoom() {
    const roomchats: any = await fetchChatRoom();
    if (sk) {
      roomchats.forEach((element: Room) => {
        sk?.emit("join-room", { chatRoomID: element.chatRoomId });
      });
      sk?.on("request", (request: any) => {
        if (request.receiver === user._id.toString()) {
          if (request.type === "ADD") {
          } else if (request.type === "NOTI") toast(request.content);
        }
      });
      sk.on("notification", (noti: any) => {
        toast(noti.sender + noti.content);
        fetchChatRoom();
      });
      sk.on("accept_status", (noti: any) => {
        fetchChatRoom();
      });
    }
  }

  useEffect(() => {
    setChatRoom();
  }, [sk]);

  useEffect(() => {
    const connect = async () => {
      const new_socket = await connectSocket();
      setSocket(new_socket);
    };
    connect();
    return disconnectSocket(sk);
  }, []);
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <Popover open={chatOpen} onOpenChange={setChatOpen}>
      <PopoverTrigger asChild>
        <Button
          className={`fixed bottom-6 right-4 rounded-full w-12 h-12 shadow-lg border-none p-3 ${
            chatOpen ? "invisible" : ""
          }`}
          variant="outline"
        >
          <Image
            className="h-10 w-10 drop-shadow-lg object-contain"
            src={chat}
            alt="chat"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="scroll-auto max-h-80vh max-w-[400px] w-[400px] fixed bottom-2 right-2">
        <div className="gap-4 py-4 h-full scroll-y-auto">
          {!openFriend && (
            <IoMdArrowRoundBack
              className="text-xl mb-6 cursor-pointer"
              onClick={() => setOpenFriend(true)}
            />
          )}
          {openFriend && (
            <div className="relative group flex flex-col gap-4 p-2 data-[collapsed=true]:p-2 overflow-auto max-h-[500px] w-full no-scrollbar">
              <div className="w-full flex gap-4 items-center">
                <Input
                  type="text"
                  value={search}
                  onChange={(e: any) => setSearch(e.target.value)}
                  placeholder="Nhập tên để tìm kiếm"
                />
                <Button className="" onClick={handleSearch}>
                  <RiSearchLine className="h-5 w-5" />
                </Button>
              </div>
              <nav className="grid gap-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2 w-full">
                <h2 className="font-medium">Danh sách bạn bè</h2>
                {searchResult.map((room: any, index: any) => (
                  <div
                    onClick={() => handleChooseFriend(room)}
                    key={index}
                    className="bg-gray-100 p-2 w-full rounded-lg cursor-pointer flex gap-x-4"
                  >
                    <Avatar>
                      <AvatarImage
                        src={room.friends.avatar}
                        alt={room.friends.avatar}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-full">
                      <span>{room.friends.name}</span>
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          )}
          <div className="z-10 border rounded-lg w-full h-full text-sm">
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
