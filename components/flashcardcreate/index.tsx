"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import { FlashcardService } from "@/app/services";
import { useQueryClient } from "@tanstack/react-query";
import { AiFillEdit } from "react-icons/ai";

export default function FlashCardCreate() {
  const sliderRef = useRef<any>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  const [flashlist, setFlashlist] = useState<any>([]);
  const [flashcards, setFlashcards] = useState<any>([]);
  const getFlashList = async () => {
    let result = await FlashcardService.getByUser();
    setFlashlist(result.data.flashcardLists);
    setFlashcards(result.data.flashcardLists[0]?.flashcards);
  };
  useEffect(() => {
    const getFlashList = async () => {
      let result = await FlashcardService.getByUser();
      setFlashlist(result.data.flashcardLists);
      setFlashcards(result.data.flashcardLists[0]?.flashcards);
    };
    getFlashList();
  }, []);
  const [flashlistname, setFlashlistname] = useState<string>("");
  const createFlashlist = async () => {
    try {
      await FlashcardService.createFlashcardList({
        name: flashlistname,
      });
      toast.success("Tạo bộ từ vựng thành công");
      getFlashList();
    } catch (err: any) {
      toast.error("Tạo thất bại");
    }
  };

  const [word, setWord] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [listid, setListid] = useState<string>("");
  const createFlashcard = async () => {
    try {
      await FlashcardService.create({
        word: word,
        answer: answer,
        listid: listid,
      });
      toast.success("Tạo flashcard thành công");
      getFlashList();
    } catch (err: any) {
      toast.error("Tạo thất bại");
    }
  };

  const [selectedFlashlist, setSelectedFlashlist] = useState<any>();

  const selectFlashlist = (idx: any) => {
    setFlashcards(flashlist[idx].flashcards);
    setSelectedFlashlist(flashlist[idx]);
    setListid(flashlist[idx]._id);
  };
  const queryClient = useQueryClient();
  const handleChangeState = async (course: any, status = "learned") => {
    let result = await FlashcardService.changeStatus(course, status);
    getFlashList();
    queryClient.invalidateQueries({ queryKey: ["progress"] });
    return result.data;
  };
  return (
    <div className="px-6 py-2 bg-background shadow-md rounded-md w-full">
      <div className="flex justify-between">
        <Select onValueChange={(value) => selectFlashlist(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Chọn bộ từ vựng" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Bộ từ vựng của bạn</SelectLabel>
              {flashlist.length > 0 &&
                flashlist.map((item: any, index: any) => {
                  return (
                    <SelectItem
                      className="truncate ..."
                      key={index}
                      value={index}
                    >
                      {item.name}
                    </SelectItem>
                  );
                })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex justify-end gap-2 ml-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="mb-2" variant="outline">
                <MdOutlineAddCircleOutline className="" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Thêm Bộ Flashcards</SheetTitle>
                <SheetDescription>
                  Tạo bộ flashcard để học tập từ vựng nhanh chóng.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="flashcardlistname" className="text-left">
                    Tên bộ flashcards
                  </Label>
                  <Input
                    onChange={(e) => setFlashlistname(e.target.value)}
                    id="flashcardlistname"
                    placeholder="Nhập tên"
                    className="col-span-3"
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button onClick={createFlashlist} type="submit">
                    Tạo mới
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="mb-2" variant="outline">
                <AiFillEdit />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Thêm Flashcard</SheetTitle>
                <SheetDescription>
                  Tạo flashcard để học tập từ vựng nhanh chóng.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Select
                  onValueChange={(value: any) => setListid(value)}
                  defaultValue={selectedFlashlist?._id}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Chọn bộ từ vựng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Bộ từ vựng của bạn</SelectLabel>
                    </SelectGroup>
                    {flashlist.length > 0 &&
                      flashlist.map((item: any, index: any) => {
                        return (
                          <SelectItem key={index} value={item._id}>
                            {item.name}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="word" className="text-right">
                    Từ vựng
                  </Label>
                  <Input
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    id="word"
                    placeholder="Hello"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="mean" className="text-right">
                    Nghĩa
                  </Label>
                  <Input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    id="mean"
                    placeholder="Xin chào"
                    className="col-span-3"
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button onClick={createFlashcard} type="submit">
                    Tạo flashcard
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation={false}
        spaceBetween={20}
        slidesPerView={1}
        ref={sliderRef}
      >
        {flashcards &&
        flashcards.filter((item: any) => item.status !== "learned").length >
          0 ? (
          flashcards
            .filter((item: any) => item.status !== "learned")
            .map((item: any, index: any) => {
              return (
                <div key={index}>
                  <SwiperSlide>
                    <div className="flex flex-col gap-2">
                      <div className="flip-card !max-h-[150px]">
                        <div className="flip-card-inner !max-h-[150px]">
                          <div className="flip-card-front h-full flex justify-center items-center bg-active !text-white font-bold text-sm">
                            {item.word}
                          </div>
                          <div className="flip-card-back h-full flex justify-center items-center bg-slate-400 font-bold text-sm">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleChangeState(item)}
                        size="sm"
                        className="text-sm"
                      >
                        Đã biết, loại khỏi danh sách ôn tập
                      </Button>
                    </div>
                  </SwiperSlide>
                </div>
              );
            })
        ) : (
          <SwiperSlide>
            <div className="h-[160px] my-4 border border-slate-400 rounded-md border-dashed flex items-center p-4 justify-center text-center text-sm">
              Nhấn vào biểu tượng chỉnh sửa để thêm mới flashcard
            </div>
          </SwiperSlide>
        )}
      </Swiper>
      {flashcards && flashcards.length > 0 && (
        <div className="flex justify-end gap-2 mt-2">
          <Button className="py-2 px-4 h-fit" onClick={handlePrev}>
            <FaArrowLeft className="h-3 w-3" />
          </Button>
          <Button className="py-2 px-4 h-fit" onClick={handleNext}>
            <FaArrowRight className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
