"use client"

import Image from "next/image"
import maleT from "@/app/assets/images/course/male_teacher.png"
import femaleT from "@/app/assets/images/course/female_teacher.png"
import stu from "@/app/assets/images/course/students.png"
import date from "@/app/assets/images/course/schedule.png"
import moment from "moment"
import Link from "next/link"

export type CourseCardProps = {
    _id?: string,
    name: string,
    student: number,
    teacher: string,
    teacher_genders?: string,
    startTime: Date,
    endTime: Date,
    img: string,
    price: number,
    downprice?: number,
    downrate?: number,
    descrip?: string;
    target?: string;
    information?: string;
    contact?: string;
    type?: string[];
}

export default function CourseCard({ course }: { course: CourseCardProps }) {
    return (
        <Link className="h-full" href={`/course/${course._id}`} target="blank">
            <div className="bg-white h-full shadow-lg rounded-lg overflow-hidden cursor-pointer hover:-translate-y-4 transition duration-300 group">
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
        </Link>
    )
}