"use client";
import { FaHeart } from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { format, formatDistance } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppSelector } from "@/app/redux/store";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/app/services";

export default function Goal() {
  const [score, setScore] = useState(20);
  const [total, setTotal] = useState(100);
  const [date, setDate] = useState<Date>();
  const current_user = useAppSelector((state) => state.auth.userinfor);
  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ["profile", current_user._id],
    queryFn: async () => {
      const res = await UserService.getUserById(current_user._id);
      return res.data;
    },
  });
  return (
    <div className="rounded-md bg-background shadow-md pt-2 pb-6 px-6 flex flex-col gap-2">
      <div className="font-medium flex items-center gap-2">
        <div className="relative w-fit">
          <span className="p-1 animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <FaHeart className="text-pink-500 text-sm" />
        </div>
        Bảng mục tiêu
      </div>
      <div className="rounded-md p-2 border border-ring border-dashed">
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
      <div className="font-medium mt-2 flex items-center gap-2">
        <div className="relative w-fit">
          <span className="p-1 animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <FaHeart className="text-pink-500 text-sm" />
        </div>
        Bảng tiến độ học tập
      </div>
      <div className="flex flex-col gap-2 rounded-md p-2 border border-ring border-dashed">
        <div className="font-medium">Ngày:</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full my-2 justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "PPP")
              ) : (
                <span>Chọn ngày để xem tiến độ</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Progress value={(score * 100) / total} />
        <div>
          <span className="font-bold text-blue-400">
            {score}/{total}
          </span>{" "}
          câu trả lời đúng
        </div>
        <div>
          Tỷ lệ trả lời đúng:{" "}
          <span className="font-bold text-green-400">
            {((score * 100) / total).toFixed(2)}%
          </span>
        </div>
        <div>
          Từ vựng đã học: <span className="font-bold text-green-400">1</span>
        </div>
      </div>
    </div>
  );
}
