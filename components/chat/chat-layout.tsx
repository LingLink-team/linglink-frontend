"use client";

import { Message, Room, userData } from "@/app/constants/data";
import React, { useEffect, useState } from "react";
import { Chat } from "./chat";
import createAxiosInstance from "@/app/utils/axiosInstance";

export const ChatLayout: React.FC<Room> = ({ chatRoomId, name, participant, friends }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <div className="scroll-auto">
      <Chat
        chatRoomId = {chatRoomId}
        selectedUser={friends}
        isMobile={isMobile}
      />
    </div>
  );
}
