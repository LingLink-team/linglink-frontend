"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import like from "@/app/assets/images/download.svg";
import dislike from "@/app/assets/images/3670156.png";
import Image from "next/image";

export const ReactionsModal = ({ reactions, isOpen, onOpenChange }: any) => {
  const [tab, setTab] = useState<string>("all");
  const tab_active = "text-primary border-b-2 border-b-primary";
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex gap-6">
              <button
                onClick={() => setTab("all")}
                className={`${
                  tab === "all" ? tab_active : ""
                } w-fit pb-2 transition-all duration-300`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setTab("like")}
                className={`${
                  tab === "like" ? tab_active : ""
                } w-fit pb-2 transition-all duration-300`}
              >
                <Image
                  className="relative z-[1] border-[1px] border-white rounded-full"
                  src={like}
                  alt="like"
                  width={24}
                  height={24}
                />
              </button>
              <button
                onClick={() => setTab("dislike")}
                className={`${
                  tab === "dislike" ? tab_active : ""
                } w-fit pb-2 transition-all duration-300`}
              >
                <Image
                  className="relative z-[1] border-[1px] border-white rounded-full"
                  src={dislike}
                  alt="dislike"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-2 mt-4">
              {(tab === "all" || tab === "like") &&
                reactions?.likeUsers?.map((user: any) => (
                  <div key={user?.user?._id}>
                    <Link
                      className="flex gap-2 items-center font-medium text-black"
                      href={`/profile/${user.user?._id}`}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={user.user?.avatar} />
                          <AvatarFallback>{user.user?.name}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0">
                          <Image
                            className="relative z-[1] border-[1px] border-white rounded-full"
                            src={like}
                            alt="like"
                            width={18}
                            height={18}
                          />
                        </div>
                      </div>
                      {user.user?.name}
                    </Link>
                  </div>
                ))}
              {(tab === "all" || tab === "dislike") &&
                reactions?.dislikeUsers?.map((user: any) => (
                  <div key={user.user?._id}>
                    <Link
                      className="flex gap-2 items-center font-medium text-black"
                      href={`/profile/${user.user?._id}`}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={user.user?.avatar} />
                          <AvatarFallback>{user.user?.name}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0">
                          <Image
                            className="relative z-[1] border-[1px] border-white rounded-full"
                            src={dislike}
                            alt="dislike"
                            width={18}
                            height={18}
                          />
                        </div>
                      </div>
                      {user.user?.name}
                    </Link>
                  </div>
                ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
