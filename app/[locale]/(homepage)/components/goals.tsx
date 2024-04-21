"use client"
import { FaHeart } from "react-icons/fa";
import { Progress } from "@/components/ui/progress"
import { useState } from "react";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export default function Goal() {
    const [score, setScore] = useState(20)
    const [total, setTotal] = useState(100)
    const [date, setDate] = useState<Date>()
    return (
        <div className="rounded-md bg-background shadow-md pt-2 pb-6 px-6 flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
                {/* <div className="font-semibold">
                    Mục tiêu :
                </div> */}
                <div className="relative">
                    <span className="p-1 animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <FaHeart className="text-pink-500 text-sm" />
                </div>
                <div className="font-semibold">Toeic</div>
            </div>
            <div className="font-medium">
                Bảng mục tiêu
            </div>
            <div className="rounded-md p-2 border border-ring border-dashed">
                Mục tiêu: 800+ Writing <br />
                Ngày thi: 22/12/2023
            </div>
            <div className="font-medium mt-2">
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
                            {date ? format(date, "PPP") : <span>Chọn ngày để xem tiến độ</span>}
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
                <Progress value={score * 100 / total} />
                <div><span className="font-bold text-blue-400">{score}/{total}</span> câu trả lời đúng</div>
                <div>Tỷ lệ trả lời đúng: <span className="font-bold text-green-400">{(score * 100 / total).toFixed(2)}%</span></div>
            </div>
        </div>
    )
}