"use client";

import Link from "next/link";
import { MoreHorizontal, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/app/constants/data";

interface SidebarProps {
  links: {
    name: string;
    messages: Message[];
    avatar: string;
    variant: "grey" | "ghost";
  }[];
  onClick?: (Room: any) => void;
}

export function Sidebar({ links, onClick }: SidebarProps) {
  return (
    <div className="relative group flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 ">
      <nav className="grid gap-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2 w-full">
        {links.map((link, index) => (
          <div
            onClick={(link) => onClick && onClick(link)}
            key={index}
            className="bg-gray-100 p-2 w-full rounded-lg cursor-pointer"
          >
            <Avatar className="flex justify-center items-center">
              <AvatarImage
                src={link.avatar}
                alt={link.avatar}
                width={6}
                height={6}
                className="w-10 h-10 "
              />
            </Avatar>
            <div className="flex flex-col w-full">
              <span>{link.name}</span>
              {/* {link.messages.length > 0 && (
                <span className="text-zinc-500 text-xs">
                  {link.messages[link.messages.length - 1].name.split(" ")[0]}:{" "}
                  {link.messages[link.messages.length - 1].message}
                </span>
              )} */}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
