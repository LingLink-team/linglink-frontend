"use client";
import { FaHeart } from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { format } from "date-fns";
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
import { ProgressService, UserService } from "@/app/services";
import more from "@/app/assets/images/icons/more.png";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AudioPlayer from "react-h5-audio-player";
import { FlashcardShowAll } from "../../flashcard/[id]/page";

export default function Goal() {
  const [date, setDate] = useState<any>(new Date());
  const current_user = useAppSelector((state) => state.auth.userinfor);
  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ["profile", current_user._id],
    queryFn: async () => {
      const res = await UserService.getUserById(current_user._id);
      return res.data;
    },
  });
  const { data: progress } = useQuery({
    queryKey: ["progress", current_user._id, date],
    queryFn: async () => {
      const res = await ProgressService.getProgress(current_user._id, date);
      return res.data;
    },
  });

  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);
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
        <div className="font-semibold text-sm">
          Ngày: {format(date, "dd/MM/yyyy")}
        </div>
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
        {progress?.length > 0 && (
          <Progress
            value={
              ((progress[0].totalQuestions.length -
                progress[0].wrongAnswerQuestions.length) *
                100) /
              (progress[0].totalQuestions.length === 0
                ? 1
                : progress[0].totalQuestions.length)
            }
          />
        )}
        <div className="flex items-center gap-2 justify-between">
          <span>
            <span className="font-bold text-blue-400">
              {progress?.length > 0 &&
                progress[0].totalQuestions.length -
                  progress[0].wrongAnswerQuestions.length}
            </span>{" "}
            câu trả lời đúng
          </span>
          <Button
            onClick={() => setIsShowDetail(true)}
            variant={"ghost"}
            size="icon"
          >
            <Image
              className="h-4 w-4"
              src={more}
              height={5}
              width={5}
              alt="more"
            />
          </Button>
        </div>
        <div>
          Tỷ lệ trả lời đúng:{" "}
          <span className="font-bold text-green-400">
            {progress?.length > 0 &&
            !isNaN(
              ((progress[0].totalQuestions.length -
                progress[0].wrongAnswerQuestions.length) *
                100) /
                progress[0].totalQuestions.length
            )
              ? (
                  ((progress[0].totalQuestions.length -
                    progress[0].wrongAnswerQuestions.length) *
                    100) /
                  progress[0].totalQuestions.length
                ).toFixed(2)
              : 0}
            %
          </span>
        </div>
        <div>
          Từ vựng đã học:{" "}
          <span className="font-bold text-green-400">
            {progress?.length > 0 && progress[0].flashcards.length}
          </span>
        </div>
      </div>
      <Dialog open={isShowDetail} onOpenChange={setIsShowDetail}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <Tabs defaultValue="word" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="word">Từ vựng</TabsTrigger>
              <TabsTrigger value="question">Trả lời câu hỏi</TabsTrigger>
            </TabsList>
            <TabsContent value="question">
              <div>
                {progress?.length > 0 &&
                  progress[0].totalQuestions.map(
                    (question: any, idx: number) => {
                      return (
                        <div
                          className="py-4 border-y border-slate-400"
                          key={idx}
                        >
                          <div className="px-6 text-lg font-semibold mb-4">
                            Câu hỏi: {question.content}
                          </div>
                          {question?.audio_url && (
                            <div className="px-6 mb-4">
                              <AudioPlayer
                                autoPlay={false}
                                // onPlay={(e: any) => console.log("onPlay")}
                                src={question.audio_url}
                                className="w-full my-2"
                              />
                            </div>
                          )}
                          <div>
                            {progress[0].wrongAnswerQuestions.find(
                              (item: any) => item._id === question._id
                            ) ? (
                              <div className="font-semibold text-red-400 text-sm pl-6 py-2">
                                Đã trả lời sai{" "}
                              </div>
                            ) : (
                              <div className="font-semibold text-green-400 text-sm pl-6 py-2">
                                Đã trả lời đúng{" "}
                              </div>
                            )}
                          </div>
                          <div className="px-6 grid grid-cols-2 gap-3">
                            {question.answers.map((answer: any, idx: any) => {
                              return (
                                <div className="w-full" key={idx}>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <div
                                        className="w-full h-full transition duration-300 hover:scale-[1.05] hover:bg-slate-200 cursor-pointer rounded-md border border-ring p-2 flex justify-center"
                                        key={idx}
                                      >
                                        {answer}
                                      </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>{`Câu hỏi: ${question.content}`}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          {idx === question.key
                                            ? "Chúc mừng bạn trả lời đúng"
                                            : "Bạn đã trả lời sai, đừng nản chí, hãy thử lại"}
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Đóng
                                        </AlertDialogCancel>
                                        {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>
            </TabsContent>
            <TabsContent value="word">
              <div>
                {progress?.length > 0 && (
                  <FlashcardShowAll data={progress[0].flashcards} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
