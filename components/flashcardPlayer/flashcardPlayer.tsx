"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "../ui/button";
import { FlashcardService } from "@/app/services";
import { useCallback, useRef } from "react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useQueryClient } from "@tanstack/react-query";

export const FlashcardPlayer = ({ flashcards }: { flashcards: any }) => {
  const queryClient = useQueryClient();
  const sliderRef = useRef<any>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  const handleChangeState = async (course: any, status = "learned") => {
    let result = await FlashcardService.changeStatus(course, status);
    queryClient.invalidateQueries({ queryKey: ["flashcardDetail"] });
    return result.data;
  };
  console.log(flashcards);
  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation={false}
        spaceBetween={20}
        slidesPerView={1}
        ref={sliderRef}
      >
        {flashcards &&
        flashcards.filter((item: any) => item.status !== "learned")
          .length > 0 ? (
          flashcards
            .filter((item: any) => item.status !== "learned")
            .map((item: any, index: any) => {
              return (
                <div key={index}>
                  <SwiperSlide>
                    <div className="flex flex-col gap-2">
                      <div className="flip-card">
                        <div className="flip-card-inner">
                          <div className="flip-card-front h-full flex justify-center items-center bg-active">
                            {item.word}
                          </div>
                          <div className="flip-card-back h-full flex justify-center items-center bg-slate-400">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleChangeState(item)}
                        size="sm"
                        className=""
                      >
                        Đã biết, loại khỏi danh sách ôn tập
                      </Button>
                    </div>
                  </SwiperSlide>
                </div>
              );
            })
        ) : (
          <div className="">Chưa tạo flashcard, hãy tạo flashcard để ôn tập từ vựng</div>
        )}
      </Swiper>
      {flashcards &&
        flashcards.filter((item: any) => item.status !== "learned")
          .length > 0 && (
          <div className="flex justify-end gap-2 mt-2">
            <Button className="" onClick={handlePrev}>
              <FaArrowLeft />
            </Button>
            <Button className="" onClick={handleNext}>
              <FaArrowRight />
            </Button>
          </div>
        )}
    </div>
  );
};
