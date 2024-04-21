"use client"

import banner from "@/app/assets/images/course/banner.webp"
import Image from "next/image"
import maleT from "@/app/assets/images/course/male_teacher.png"
import femaleT from "@/app/assets/images/course/female_teacher.png"
import stu from "@/app/assets/images/course/students.png"
import date from "@/app/assets/images/course/schedule.png"
import moment from "moment"
import { CourseService } from "@/app/services"
import { useQuery } from "@tanstack/react-query"
import parser from "html-react-parser"

const CourseDetail: React.FC = async ({ params }: any) => {
    const { data: course, isPending } = useQuery({
        queryKey: ["courseDetail", params.id],
        queryFn: async () => {
            let result = await CourseService.getCourse(params.id)
            return result.data
        }
    }) as { data: any, isPending: boolean, error: any };
    return (
        <div>
            {
                course && <>
                    <div className="relative h-[340px]">
                        <Image className="object-cover inset-0 absolute h-full w-full" src={banner} alt="banner" />
                        <div className="absolute inset-0 z-[1] bg-slate-500 opacity-40" />
                        <div className="relative z-[2] container justify-center flex flex-col py-8 items-start h-full">
                            <div className="w-2/3 text-white">
                                <h1 className="font-bold uppercase text-2xl">
                                    {course.name}
                                </h1>
                                <p className="mt-4">
                                    {parser(course.descrip)}
                                </p>
                            </div>
                        </div>
                        <div className="absolute inset-0 container top-1/4">
                            <div className="relative w-full">
                                <div className="absolute right-0 z-[3] w-full flex justify-end">
                                    <div className="bg-white h-full w-1/4 shadow-lg rounded-lg overflow-hidden hover:-translate-y-4 transition duration-300 group">
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <Image
                                                className="group-hover:scale-[1.1] transition duration-300 object-cover w-full h-full"
                                                src={course.img}
                                                layout="fill"
                                                alt={course.name}
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
                                            <p className="text-gray-600 mb-2 flex items-center gap-2">
                                                <Image
                                                    className="w-5 h-5"
                                                    src={course.teacher_genders === "male" ? maleT : femaleT}
                                                    alt={"illustration"}
                                                />
                                                <span className="font-medium">Giáo viên: </span> {course.teacher}
                                            </p>
                                            <p className="text-gray-600 mb-2 flex items-center gap-2">
                                                <Image
                                                    className="w-5 h-5"
                                                    src={stu}
                                                    alt={"illustration"}
                                                />
                                                <span className="font-medium">Số lượng học viên: </span> {course.student.toLocaleString('vi-VN')}
                                            </p>
                                            <p className="text-gray-600 mb-2 flex items-center gap-2">
                                                <Image
                                                    className="w-5 h-5"
                                                    src={date}
                                                    alt={"illustration"}
                                                />
                                                <span className="font-medium">Ngày bắt đầu: </span>{moment(course.startTime).format("DD/MM/YYYY")}
                                            </p>
                                            <p className="text-gray-600 mb-2 flex items-center gap-2">
                                                <Image
                                                    className="w-5 h-5"
                                                    src={date}
                                                    alt={"illustration"}
                                                />
                                                <span className="font-medium">Ngày kết thúc: </span>{moment(course.endTime).format("DD/MM/YYYY")}
                                            </p>
                                            <div className="flex justify-between items-center font-bold">
                                                <div>
                                                    {course.downprice ? (
                                                        <div className="flex items-center flex-col gap-2">
                                                            <span className="text-primary">{course.downprice.toLocaleString('vi-VN')} VNĐ</span>
                                                            <span className="text-gray-600 line-through">{course.price.toLocaleString('vi-VN')} VNĐ</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-primary">{course.price.toLocaleString('vi-VN')} VNĐ</span>
                                                    )}
                                                </div>
                                                {course.downrate && (
                                                    <div className="bg-red-500 text-white rounded-md px-2 py-1">
                                                        {course.downrate}% Off
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container my-8">
                        <div className="w-2/3 flex flex-col gap-8">
                            <div className="shadow-md py-4 bg-white w-full rounded-lg px-4">
                                <h2 className="text-primary font-bold mb-4">
                                    Bạn sẽ đạt được gì sau khóa học
                                </h2>
                                <div>
                                    {parser(course.target)}
                                </div>
                            </div>
                            <div className="shadow-md py-4 bg-white w-full rounded-lg px-4">
                                <h2 className="text-primary font-bold mb-4">
                                    Thông tin khóa học
                                </h2>
                                <div>
                                    {parser(course.information)}
                                </div>
                            </div>
                            <div className="shadow-md py-4 bg-white w-full rounded-lg px-4">
                                <h2 className="text-primary font-bold mb-4">
                                    Thông tin liên hệ
                                </h2>
                                <div>
                                    {parser(course.contact)}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default CourseDetail