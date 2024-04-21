"use client";

import Image from "next/image";
import React, { useState } from "react";
import banner from "@/app/assets/images/flashcard/banner.jpg";
import { Button } from "@/components/ui/button";
import { FaWindowRestore } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { SlNote } from "react-icons/sl";
import { LuWholeWord } from "react-icons/lu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FlashcardService } from "@/app/services";
import { CustomPagination } from "@/components/pagination";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import Link from "next/link";
import { renderSkeletons } from "@/app/utils/common";

const Banner: React.FC = () => {
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
          Flashcards
        </h1>
        <div className="mt-4 flex gap-4">
          <Button>Bộ từ vựng</Button>
          <Button variant="secondary">Khám phá</Button>
        </div>
      </div>
    </div>
  );
};

const FlashcardListThumbnail = ({ data, key }: { data: any; key: number }) => {
  return (
    <div
      key={key}
      className="border border-gray-400 p-4 rounded-lg flex flex-col gap-3"
    >
      <h3 className="text-center font-bold">{data.name}</h3>
      <div className="flex items-center gap-2">
        <LuWholeWord />
        {data.flashcards.length} từ
      </div>
      <div className="flex items-center gap-2">
        <SlNote />
        {
          data.flashcards?.filter((item: any) => item.status === "learned")
            .length
        }{" "}
        từ đã nhớ
      </div>
      <div className="mt-4 w-full">
        <Link href={`/flashcard/${data._id}`}>
          <Button variant="outline" className="w-full">
            Học
          </Button>
        </Link>
      </div>
    </div>
  );
};

const CreateFlashcardList = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState<string>("");
  const handleCreate = async () => {
    await FlashcardService.createFlashcardList({ name: name });
    toast.success("Tạo bộ từ vựng mới thành công");
    queryClient.invalidateQueries({ queryKey: ["flashcardlists"] });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 mb-4">
          <IoIosAddCircle />
          Thêm bộ từ vựng
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm bộ từ vựng</DialogTitle>
          <DialogDescription>
            Nhập thông tin bộ từ vựng để tạo mới
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tên bộ từ vựng
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(event: any) => setName(event.target.value)}
              className="col-span-3"
              placeholder="Nhập tên"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button onClick={handleCreate} type="submit">
              Tạo mới
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Flashcard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const { data, isPending } = useQuery({
    queryKey: ["flashcardlists", currentPage, pageSize],
    queryFn: async () => {
      let result = await FlashcardService.getByUser(currentPage, pageSize);
      setTotal(Math.ceil(result.data.total / pageSize));
      return result.data;
    },
  }) as { data: any; isPending: boolean; error: any };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="">
      <Banner />
      <div className="container my-4">
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div>
            <CreateFlashcardList />
          </div>
          {isPending && (
            <div className="mt-8 grid grid-cols-6 gap-x-4 gap-y-8">
              {renderSkeletons()}
            </div>
          )}
          <div className="grid grid-cols-6 gap-4">
            {data?.flashcardLists.map((item: any, idx: number) => (
              <FlashcardListThumbnail data={item} key={idx} />
            ))}
          </div>
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
  );
};

export default Flashcard;
