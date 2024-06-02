import { Message, User } from "@/app/constants/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React, { useEffect } from "react";
import createAxiosInstance from "@/app/utils/axiosInstance";
import { useSocketStore } from "@/app/store/socketStore";

interface ChatProps {
  messages?: Message[];
  selectedUser: User;
  isMobile: boolean;
  chatRoomId: string;
}

export function Chat({ selectedUser, isMobile, chatRoomId }: ChatProps) {
  const { socket: sk } = useSocketStore();
  const [messagesState, setMessages] = React.useState<Message[]>([]);
  const axiosInstance = createAxiosInstance();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/message`,
          {
            params: {
              chatRoomId: chatRoomId,
            },
          }
        );

        setMessages(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    // get messages history for chat room
    getMessages();

    sk?.on("getmessage", (newMessage: any) => {
      console.log("RUN")
      if (newMessage.chatRoomId == chatRoomId)
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up listener when component unmounts
    return () => {
      sk?.off("getmessage");
    };
  }, [sk]);

  const sendMessage = (newMessage: Message) => {
    sk?.emit("chat", {
      content: newMessage.content,
      chatRoomId: chatRoomId,
      imgs_url: newMessage.imgs_url,
      from: newMessage.from,
    });
  };

  return (
    <div className="flex flex-col justify-between w-full h-fit max-h-[500px]">
      <ChatTopbar selectedUser={selectedUser} />
      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
