"use client";

import React, {useState } from "react";
import CourseCard, { CourseCardProps } from "./course";
import { CourseService } from "@/app/services";
import { CustomPagination } from "@/components/pagination";
import { useQuery } from "@tanstack/react-query";

const CourseList = ({ filter }: { filter: any }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const { data, isPending } = useQuery({
    queryKey: ["courses", currentPage, pageSize, filter],
    queryFn: async () => {
      let result = await CourseService.getCourses(
        currentPage,
        pageSize,
        filter
      );
      return result.data;
    },
  }) as { data: any; isPending: boolean; error: any };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < 8; i++) {
      skeletons.push(
        <div key={i} className="mb-4 h-48 animate-pulse">
          <div className="bg-slate-200 h-full w-full rounded-lg"></div>
        </div>
      );
    }
    return skeletons;
  };
  return (
    <>
      {isPending && (
        <div className="mt-8 grid grid-cols-3 gap-x-4 gap-y-8">
          {renderSkeletons()}
        </div>
      )}
      {data && (
        <>
          <div className="mt-8 grid grid-cols-3 gap-x-4 gap-y-8">
            {data.courses.map((item: CourseCardProps, idx: number) => (
              <CourseCard course={item} key={idx} />
            ))}
          </div>
          <div className="mt-6">
            <CustomPagination
              currentPage={currentPage}
              totalPages={data.totalPage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </>
  );
};

export default CourseList;
