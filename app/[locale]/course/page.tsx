"use client";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import banner from "@/app/assets/images/course/courses_banner.png";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "rc-slider/assets/index.css";
import { FaFilter } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import CourseList from "./components/courseList";
import { Checkbox } from "@/components/ui/checkbox";
import { debounce } from "lodash";

const Banner: React.FC = () => {
  return (
    <div className="w-full">
      <Image className="object-cover h-full w-full" src={banner} alt="banner" />
    </div>
  );
};

const Descrip: React.FC = () => {
  return (
    <div className="container mt-8">
      <h1 className="font-bold text-2xl mb-2">Khóa học</h1>
      <h2>
        Các khóa học được chuẩn bị bởi các giáo viên dày dặn kinh nghiệm, đảm
        bảo chất lượng. Cam kết mang lại hiệu quả tốt nhất cho học viên.
      </h2>
    </div>
  );
};

const Course: React.FC = () => {
  const [filter, setFilter] = useState<any>({});
  const [range, setRange] = useState<any>([20, 80]);
  const [date, setDate] = useState<any>(null);

  // Debounce function with 500ms delay
  const debounceSetFilter = debounce((newFilter: any) => {
    setFilter(newFilter);
  }, 500);

  const handleNameChange = (event: any) => {
    debounceSetFilter({ ...filter, name: event.target.value });
  };

  const handleSortChange = (value: any) => {
    debounceSetFilter({ ...filter, sort: value });
  };

  const handleCheckboxChange = (id: any, checked: any) => {
    let type = { ...(filter.type || {}), [id]: checked };
    debounceSetFilter({ ...filter, type: type });
  };

  const handleDateSelect = (selectedDate: any) => {
    setDate(selectedDate);
    debounceSetFilter({ ...filter, startDate: selectedDate });
  };

  const handleRangeChange = (newRange: any) => {
    setRange(newRange);
    debounceSetFilter({ ...filter, priceRange: newRange });
  };
  return (
    <div>
      <Banner />
      <Descrip />
      <div className="flex gap-6 container h-full">
        <div className="w-1/4 flex-1">
          <div className="mt-8 w-full bg-white rounded-md p-4 pb-8 shadow-lg sticky top-[100px]">
            <div className="w-full flex flex-col gap-6 justify-center items-center">
              <div className="w-full">
                <div className="flex gap-3 items-center w-full relative">
                  <Input
                    onChange={handleNameChange}
                    className="w-full"
                    placeholder="Nhập tên khóa học muốn tìm"
                  />
                  {/* <FcSearch className="absolute right-2 -translate-y-1/2 top-1/2 cursor-pointer text-3xl hover:scale-125 transition duration-300" /> */}
                </div>
              </div>
              <div className="flex gap-3 items-center w-full justify-center">
                <div className="flex items-center gap-2 font-medium text-nowrap">
                  <FaFilter />
                  Xếp theo
                </div>
                <Select value={filter?.sort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chọn cách sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sắp xếp</SelectLabel>
                      <SelectItem value="price_down">Giá giảm dần</SelectItem>
                      <SelectItem value="price_up">Giá tăng dần</SelectItem>
                      <SelectItem value="student_down">
                        Số học viên giảm dần
                      </SelectItem>
                      <SelectItem value="student_up">
                        Số học viên tăng dần
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {/* <div className="w-[100%] flex items-center gap-4">
                    <div className="text-nowrap font-medium">
                        Lọc theo giá
                    </div>
                    <div className="flex flex-col w-full gap-3">
                        <Slider
                            min={0}
                            max={100}
                            value={range}
                            range
                            onChange={handleRangeChange}
                        />
                        <div className="flex w-full justify-between text-sm">
                            <div>
                                Thấp: {range[0]}
                            </div>
                            <div>
                                Cao: {range[1]}
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
            <div className="mt-4">
              <div className="w-fit">
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
                        <span>Chọn ngày bắt đầu học</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {/* <div className="flex flex-col gap-3 mt-4">
                <h3 className="font-medium">Loại khóa học</h3>
                <div className="flex gap-3 items-center">
                    <Checkbox id="TOEIC" checked={filter?.TOEIC} onCheckedChange={(value: any) => handleCheckboxChange("TOEIC", value)} />
                    <label
                        htmlFor="TOEIC"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        TOEIC
                    </label>
                </div>
                <div className="flex gap-3 items-center">
                    <Checkbox id="IELTS" checked={filter?.IELTS} onCheckedChange={(value: any) => handleCheckboxChange("IELTS", value)} />
                    <label
                        htmlFor="IELTS"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        IELTS
                    </label>
                </div>
                <div className="flex gap-3 items-center">
                    <Checkbox id="TOEFL" checked={filter?.TOEFL} onCheckedChange={(value: any) => handleCheckboxChange("TOEFL", value)} />
                    <label
                        htmlFor="TOEFL"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        TOEFL
                    </label>
                </div>
            </div>
            <Button className="mt-2 mr-2" onClick={(event) => { event.preventDefault(); console.log("==filter==", filter) }}>
                Lọc
            </Button> */}
          </div>
        </div>
        <div className="w-3/4 h-full">
          <CourseList filter={filter} />
        </div>
      </div>
    </div>
  );
};

export default Course;
