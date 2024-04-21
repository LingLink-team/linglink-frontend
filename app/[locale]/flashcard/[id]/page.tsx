"use client";

import { FlashcardService } from "@/app/services";
import { renderSkeletons } from "@/app/utils/common";
import { CustomPagination } from "@/components/pagination";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaWindowRestore } from "react-icons/fa";
import banner from "@/app/assets/images/flashcard/banner.jpg";
import { MdDelete } from "react-icons/md";
import { IoVolumeHighSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { FlashcardPlayer } from "@/components/flashcardPlayer/flashcardPlayer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Banner = ({ name }: { name: string }) => {
  return (
    <div className="w-full relative flex items-center h-[200px]">
      <div className="absolute inset-0 bg-black opacity-25 z-[1]" />
      <Image
        className="object-cover h-full w-full absolute inset-0 z-0"
        src={banner}
        alt="banner"
        priority
      />
      <div className="relative z-[2] container text-white">
        <h1 className="font-bold text-3xl flex gap-2 items-center">
          <FaWindowRestore />
          {name}
        </h1>
      </div>
    </div>
  );
};

const FlashcardThumbnail = ({
  data,
  key,
  flashcardList,
}: {
  data: any;
  key: number;
  flashcardList: string;
}) => {
  const queryClient = useQueryClient();
  const handleRemove = async () => {
    await FlashcardService.removeFlashcardfromFlashcardList(
      flashcardList,
      data._id
    );
    toast.success("Xóa flashcard thành công");
    queryClient.invalidateQueries({ queryKey: ["flashcardDetail"] });
  };
  return (
    <div
      key={key}
      className="border border-gray-400 p-4 rounded-lg flex flex-col gap-3"
    >
      <h3 className="text-center font-bold flex justify-between items-center">
        {data.word}
        <button>
          <IoVolumeHighSharp />
        </button>
      </h3>
      <div className="mt-4 w-full">Định nghĩa:</div>
      <div>{data.answer}</div>
      <div className="w-full justify-center flex">
        {data.status === "learned" && (
          <div className="py-1 px-2 text-[12px] mt-6 rounded-full bg-primary text-primary-foreground w-fit">
            Đã thuộc
          </div>
        )}
      </div>
      <div className="mt-2">
        <button onClick={() => handleRemove()}>
          <MdDelete />
        </button>
      </div>
    </div>
  );
};

const FlashcardShowAll = ({ data }: { data: any }) => {
  const queryClient = useQueryClient();
  const handleChangeState = async (course: any, status = "") => {
    let result = await FlashcardService.changeStatus(course, status);
    queryClient.invalidateQueries({ queryKey: ["flashcardDetail"] });
    return result.data;
  };
  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar">
      <h2 className="text-center uppercase mb-6 font-semibold">
        Danh sách Flashcard
      </h2>
      <div className="flex flex-col gap-4">
        {data.map((item: any, index: number) => (
          <div
            className="border rounded-lg p-3 flex flex-col gap-4"
            key={index}
          >
            <div>{item.word}</div>
            <div>Định nghĩa: {item.answer}</div>
            {item?.status && item.status === "learned" ? (
              <div className="p-2 rounded-full bg-green-200 w-fit text-[10px] font-bold text-green-500">
                Đã thuộc
              </div>
            ) : (
              <div className="p-2 rounded-full bg-red-200 w-fit text-[10px] font-bold text-red-500">
                Chưa thuộc
              </div>
            )}
            {item?.status && item.status === "learned" && (
              <Button
                onClick={() => handleChangeState(item)}
                size="sm"
                className="w-fit"
              >
                Chuyển về danh sách ôn tập
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const FlashcardListDetail = ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [word, setWord] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const { data, isPending } = useQuery({
    queryKey: ["flashcardDetail", id],
    queryFn: async () => {
      let result = await FlashcardService.getByFlashcardListId(id);
      setTotal(Math.ceil(result[0].flashcards.length / pageSize));
      return result[0];
    },
  }) as { data: any; isPending: boolean; error: any };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    const newData =
      data?.flashcards?.slice(
        currentPage - 1,
        currentPage - 1 + pageSize - 1
      ) ?? [];
    setCurrentData(newData);
  }, [currentPage, pageSize, data]);
  const createFlashcard = async () => {
    try {
      await FlashcardService.create({
        word: word,
        answer: answer,
        listid: id,
      });
      toast.success("Tạo flashcard thành công");
      queryClient.invalidateQueries({ queryKey: ["flashcardDetail"] });
    } catch (err: any) {
      toast.error("Tạo thất bại");
    }
  };
  return (
    <div>
      <Banner name={data?.name} />
      <div className="container mt-6">
        <div className="mt-8 p-4 shadow-lg bg-white rounded-lg">
          <h2 className="font-semibold text-xl">
            Danh sách này có: {currentData?.length} từ
          </h2>
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="my-4">Luyện tập</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] flex items-center justify-center">
                <div className="max-w-[500px] w-fit px-6">
                  <FlashcardPlayer flashcards={data?.flashcards} />
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="my-4">Tạo Flashcard</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] flex flex-col items-center">
                <DialogHeader>
                  <h2 className="font-bold">Nhập thông tin để tạo flashcard</h2>
                </DialogHeader>
                <div className="max-w-[500px] w-fit px-6 flex flex-col gap-4">
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
                <DialogFooter>
                  <DialogClose>
                    <Button onClick={createFlashcard} type="submit">
                      Tạo mới
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="my-4">Xem thống kê</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] flex items-center flex-col justify-center max-h-[80vh] overflow-y-auto">
                <FlashcardShowAll data={data?.flashcards} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-6 gap-4 mt-4">
            {isPending && renderSkeletons()}
            {currentData.length > 0 &&
              currentData.map((item: any, index: number) => (
                <FlashcardThumbnail
                  data={item}
                  key={index}
                  flashcardList={id}
                />
              ))}
            {!isPending && currentData.length <= 0 && "Chưa có flashcards"}
          </div>
          <div className="mt-6">
            <CustomPagination
              currentPage={currentPage}
              totalPages={total}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardListDetail;
