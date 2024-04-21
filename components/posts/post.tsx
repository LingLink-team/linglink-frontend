"use client"
import React, { useEffect, useState } from "react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { TfiMoreAlt } from "react-icons/tfi";
import Image from "next/image";
import dislike from "@/app/assets/images/3670156.png"
import like from "@/app/assets/images/download.svg"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FaRegComment } from "react-icons/fa";
import Comment from "../comments/comment";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from 'date-fns';
import AudioPlayer from 'react-h5-audio-player';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { Input } from "../ui/input";
import { IoSend } from "react-icons/io5";
import { CommentService, PostService, ReactionService } from "@/app/services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/app/redux/store";
import { Button } from "../ui/button";
import { toast } from "react-toastify"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

// function UpdatePost = ({ post, children }: { post: any, deletepost })  {

//     return (
//         <Sheet>
//             <SheetTrigger asChild>
//                 <div className="bg-gray-100 hover:bg-slate-200 transition duration-300 cursor-pointer w-full rounded-2xl p-3 text-gray-400">
//                     A à, Bạn đang nghĩ gì thế ?
//                 </div>
//             </SheetTrigger>
//             <SheetContent className="overflow-y-scroll max-h-screen" side="top">
//                 <SheetHeader>
//                     <SheetTitle>Tạo bài viết mới</SheetTitle>
//                     <SheetDescription>
//                         Bạn muốn tạo bài viết gì ?
//                     </SheetDescription>
//                 </SheetHeader>
//                 <Dialog>
//                     <div className="">
//                         <div className="flex flex-col gap-3 my-4">
//                             <Select value={topic} onValueChange={(value) => setTopic(value)}>
//                                 <Label htmlFor="topic" className="after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold text-left">
//                                     Chủ đề
//                                 </Label>
//                                 <SelectTrigger id="topic" className="w-[180px]">
//                                     <SelectValue placeholder="Chọn chủ đề" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectGroup>
//                                         <SelectLabel>Chủ đề</SelectLabel>
//                                         {topics && topics.map((topic: any, index: any) => {
//                                             return <SelectItem key={index} value={topic._id}>{topic.topicName}</SelectItem>
//                                         })}
//                                     </SelectGroup>
//                                 </SelectContent>
//                             </Select>
//                             <Label htmlFor="content" className="after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold text-left">
//                                 Nội dung
//                             </Label>
//                             <Textarea id="content" placeholder='Nhập nội dung bài viết' onChange={(event) => setInput(event.target.value)} value={input} className="col-span-3">
//                             </Textarea>
//                             <div className="w-full justify-between flex">
//                                 {/* <Dialog> */}
//                                 <DialogTrigger asChild>
//                                     <Button variant="outline">Thêm câu hỏi</Button>
//                                 </DialogTrigger>
//                                 <DialogContent className="overflow-y-scroll max-h-screen max-w-[800px]">
//                                     <DialogHeader>
//                                         <DialogTitle>Thêm câu hỏi</DialogTitle>
//                                         <DialogDescription>
//                                             Tạo quiz bằng cách điền form bên dưới
//                                         </DialogDescription>
//                                     </DialogHeader>
//                                     <div className="grid gap-4 py-4">
//                                         <div className="grid grid-cols-4 items-center gap-4">
//                                             <Label htmlFor="question" className="text-right">
//                                                 Câu hỏi
//                                             </Label>
//                                             <Input
//                                                 value={question}
//                                                 onChange={(e) => setQuestion(e.target.value)}
//                                                 id="question"
//                                                 placeholder="Viết câu hỏi"
//                                                 className="col-span-3"
//                                             />
//                                         </div>
//                                         <div className="grid grid-cols-4 items-center gap-4">
//                                             <Label htmlFor="audio" className="text-right">
//                                                 File ghi âm (nếu có):
//                                             </Label>
//                                             <Input
//                                                 value={audio}
//                                                 onChange={(e) => setAudioFile(e.target.files ? e.target.files[0] : null)}
//                                                 type="file"
//                                                 id="audio"
//                                                 placeholder="Chọn file ghi âm"
//                                                 className="col-span-3"
//                                                 accept=".mp3,audio/*"
//                                             />
//                                         </div>
//                                         {
//                                             audioFile && (
//                                                 <div className="items-center w-full">
//                                                     <Label htmlFor="audio" className="text-right my-2">
//                                                         File ghi âm đã chọn:
//                                                     </Label>
//                                                     <AudioPlayer
//                                                         autoPlay={false}
//                                                         // onPlay={(e: any) => console.log("onPlay")}
//                                                         src={URL.createObjectURL(audioFile)} className="w-full my-2" />
//                                                     <Button onClick={() => { setAudio(""); setAudioFile(null) }}>Xóa</Button>
//                                                 </div>
//                                             )
//                                         }
//                                         <div>
//                                             <Label>Chọn đáp án</Label>
//                                             <Select onValueChange={(value) => setKey(value)} >
//                                                 <SelectTrigger className="w-[200px] mt-2">
//                                                     <SelectValue placeholder="Chọn đáp án" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     <SelectGroup>
//                                                         <SelectLabel>Chọn đáp án của đề bài</SelectLabel>
//                                                         {
//                                                             answers && answers.map((item: any, idx: any) => {
//                                                                 return <SelectItem key={idx} value={idx}>{item}</SelectItem>
//                                                             })
//                                                         }
//                                                     </SelectGroup>
//                                                 </SelectContent>
//                                             </Select>
//                                             <div className="flex flex-col gap-2 my-4">
//                                                 {answers.map((answer, index) => (
//                                                     <div className="flex gap-4 items-center" key={index}>
//                                                         <div className="font-bold">
//                                                             {listanswer[index]}.
//                                                         </div>
//                                                         <Input
//                                                             type="text"
//                                                             value={answer}
//                                                             onChange={(e) => handleAnswerChange(index, e.target.value)}
//                                                         />
//                                                         {/* Hiển thị select chọn đáp án */}
//                                                         {/* Nút xóa đáp án */}
//                                                         <Button onClick={() => removeAnswer(index)}>Xóa</Button>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                         {/* Nút thêm đáp án */}
//                                         <Button onClick={addAnswer}>Thêm câu trả lời</Button>
//                                     </div>
//                                     <DialogFooter>
//                                         <DialogClose asChild>
//                                             <Button onClick={addquestion} type="submit">Tạo câu hỏi</Button>
//                                         </DialogClose>
//                                     </DialogFooter>
//                                 </DialogContent>
//                                 {/* </Dialog> */}
//                                 <Popover modal={true}>
//                                     <PopoverTrigger>
//                                         <Button variant="outline"><MdOutlineEmojiEmotions className="text-2xl" /></Button>
//                                     </PopoverTrigger>
//                                     <PopoverContent className="overflow-auto">
//                                         <EmojiPicker width="100%" onEmojiClick={onEmojiClick} />
//                                     </PopoverContent>
//                                 </Popover>
//                             </div>
//                         </div>
//                         <div>
//                             {previewquestion !== null && <div>
//                                 <div>
//                                     <div className="px-6 text-lg font-semibold mb-4">
//                                         Câu hỏi: {previewquestion.content}
//                                     </div>
//                                     <div className="flex">
//                                         <DialogTrigger asChild>
//                                             <Button className="ml-6 mb-4">Sửa câu hỏi</Button>
//                                         </DialogTrigger>
//                                         <Button className="ml-6 mb-4" onClick={deletequestion}>Xóa câu hỏi</Button>
//                                     </div>
//                                     <div className="px-6 grid grid-cols-2 gap-3">
//                                         {
//                                             previewquestion.answers.map((answer: any, idx: any) => {
//                                                 return (
//                                                     <div className="w-full" key={idx}>
//                                                         <AlertDialog>
//                                                             <AlertDialogTrigger asChild>
//                                                                 <div className="w-full transition duration-300 hover:scale-[1.02] hover:bg-slate-200 cursor-pointer rounded-md border border-ring p-2 flex justify-center" key={idx}>
//                                                                     {answer}
//                                                                 </div>
//                                                             </AlertDialogTrigger>
//                                                             <AlertDialogContent>
//                                                                 <AlertDialogHeader>
//                                                                     <AlertDialogTitle>{`Đáp án câu hỏi là: ${previewquestion.answers[key]}`}</AlertDialogTitle>
//                                                                     <AlertDialogDescription>
//                                                                         {idx === key ? "Chúc mừng bạn trả lời đúng" : "Bạn đã trả lời sai, đừng nản chí, hãy thử lại"}
//                                                                     </AlertDialogDescription>
//                                                                 </AlertDialogHeader>
//                                                                 <AlertDialogFooter>
//                                                                     <AlertDialogCancel>Đóng</AlertDialogCancel>
//                                                                     {/* <AlertDialogAction>Continue</AlertDialogAction> */}
//                                                                 </AlertDialogFooter>
//                                                             </AlertDialogContent>
//                                                         </AlertDialog>
//                                                     </div>
//                                                 )
//                                             })
//                                         }
//                                     </div>
//                                 </div>
//                             </div>}
//                         </div>
//                         <div className="text-md font-semibold mt-2">Hình Ảnh</div>
//                         <div {...imageroot({ className: 'dropzone py-5 px-3 border border-ring flex justify-center border-dashed cursor-pointer rounded-md' })}>
//                             <input {...image_inputprops()} />
//                             <div className="flex flex-col gap-2 items-center justify-center">
//                                 <p className="text-4xl font-medium">+</p>
//                                 <div>
//                                     Thêm ảnh bằng cách nhấn chọn hoặc kéo thả
//                                 </div>
//                             </div>
//                         </div>
//                         <aside className="mt-2">
//                             <ul className="grid grid-cols-6 gap-4">{files_image}</ul>
//                         </aside>
//                     </div>
//                 </Dialog>
//                 <SheetFooter>
//                     <SheetClose asChild>
//                         <Button onClick={createPost} className="mt-2" type="submit">Tạo bài viết</Button>
//                     </SheetClose>
//                 </SheetFooter>
//             </SheetContent>
//         </Sheet>
//     )
// }

const Header = ({ data, deletepost }: { data: any, deletepost: any }) => {
    const user = useAppSelector(state => state.auth.userinfor)
    const handleDeletePost = async () => {
        if (user._id === data.author._id) {
            await PostService.deletePost(data._id)
            toast.success("Xóa bài viết thành công")
            deletepost(data._id)
        }
        else {
            toast.warn("Chỉ có tác giả của bài viết mới có thể xóa")
        }
    }
    return (
        <div className="flex flex-row justify-between px-6 items-center">
            <div className="flex flex-row items-center gap-3">
                <div>
                    <Avatar>
                        <AvatarImage src={data.author.avatar} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <div className="font-semibold">
                        {data.author.name}
                    </div>
                    <div className="text-[13px] font-semibold text-primary">
                        Chủ đề: {data.topic.topicName}
                    </div>
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <div>
                    <div className="text-stone-500 text-sm">
                        {format(new Date(data.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                    </div>
                </div>
                <div className="rounded-full p-1 flex items-center hover:bg-secondary cursor-pointer">
                    <Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <TfiMoreAlt className="text-xl text-slate-600" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Tác vụ</DropdownMenuLabel>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem>Xóa</DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Bạn có chắc chắn?</DialogTitle>
                                <DialogDescription>
                                    Khi nhấn xác nhận sẽ xóa bài viết !
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                    <Button onClick={handleDeletePost} type="button">
                                        Xác nhận
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}

const Body = ({ content }: { content: any }) => {
    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="px-6">
                {content.content}
            </div>
            {
                content.imgs_url &&
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    spaceBetween={10}
                    slidesPerView={'auto'}
                    navigation={true}
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                >
                    {
                        content.imgs_url && content.imgs_url.map((img: any, index: any) => (
                            <SwiperSlide className="!flex justify-center" key={index}>
                                <Image className="w-fit h-auto max-h-[500px]" height={0} width={0} src={img} alt="illustration" />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            }
            {
                content.question !== null &&
                <div>
                    <div className="px-6 text-lg font-semibold mb-4">
                        Câu hỏi: {content.question.content}
                    </div>
                    {
                        content.question?.audio_url &&
                        <div className="px-6 mb-4">
                            <AudioPlayer
                                autoPlay={false}
                                // onPlay={(e: any) => console.log("onPlay")}
                                src={content.question.audio_url}
                                className="w-full my-2" />
                        </div>
                    }
                    <div className="px-6 grid grid-cols-2 gap-3">
                        {
                            content.question.answers.map((answer: any, idx: any) => {
                                return (
                                    <div className="w-full" key={idx}>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <div className="w-full h-full transition duration-300 hover:scale-[1.05] hover:bg-slate-200 cursor-pointer rounded-md border border-ring p-2 flex justify-center" key={idx}>
                                                    {answer}
                                                </div>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{`Câu hỏi: ${content.question.content}`}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {idx === content.question.key ? "Chúc mừng bạn trả lời đúng" : "Bạn đã trả lời sai, đừng nản chí, hãy thử lại"}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Đóng</AlertDialogCancel>
                                                    {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }
        </div >
    )
}

export const Post = ({ data, deletepost }: { data: any, deletepost: any }) => {
    const user = useAppSelector(state => state.auth.userinfor)
    const queryClient = useQueryClient();
    const [id] = useState<string>(data?.data?._id ?? "")
    const [reaction, setReaction] = useState<string>("")
    const [numlikes, setNumLikes] = useState<number>(data.numlikes)
    const [numdislikes, setNumDisLikes] = useState<number>(data.numdislikes)
    const [numcomments, setNumComments] = useState<number>(data.data.numComments)
    const { data: comments, isFetching } = useQuery({
        queryKey: ['comments', id],
        queryFn: async () => {
            const response = await CommentService.getComments(data.data._id);
            return response.data;
        },
        // keepPreviousData: true,
        refetchOnWindowFocus: false,
        retry: false
    });


    const [comment, setComment] = useState<string>("");
    const onEmojiClick = (emojiObject: any, event: any) => {
        setComment((prevInput) => prevInput + emojiObject.emoji);
    };
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const handleComment = async () => {
        try {
            setIsLoading(true)
            const commentToCreate = {
                content: comment,
                post: data.data._id,
            };
            const response = await CommentService.createComment(commentToCreate);
            setNumComments(numcomments + 1)
            setComment("")
            queryClient.invalidateQueries({ queryKey: ['comments', id] });
            setIsLoading(false)
        } catch (error: any) {
            setIsLoading(false)
            console.error('Failed to create comment:', error.message);
        }
    }

    const handleReactionPost = async (type: string) => {
        try {
            if (type === "likepost") {
                if (reaction === "likepost") {
                    setNumLikes(numlikes - 1)
                    setReaction("")
                }
                else {
                    setNumLikes(numlikes + 1)
                    setReaction("likepost")
                    if (reaction == "dislikepost") setNumDisLikes(numdislikes - 1)
                }
            }
            else if (type === "dislikepost") {
                if (reaction === "dislikepost") {
                    setNumDisLikes(numdislikes - 1)
                    setReaction("")
                }
                else {
                    setNumDisLikes(numdislikes + 1)
                    setReaction("dislikepost")
                    if (reaction == "likepost") setNumLikes(numlikes - 1)
                }
            }
            const response = await ReactionService.reactionPost(type, id);
            // queryClient.invalidateQueries({ queryKey: ['reactions', id] });
        } catch (error: any) {
            console.error('Failed to reaction:', error.message);
        }
    }
    useEffect(() => {
        if (data.like) setReaction("likepost")
        if (data.dislike) setReaction("dislikepost")
    }, [])
    const addcomment = async () => {
        setNumComments(numcomments + 1)
    }
    const deletecomment = async () => {
        setNumComments(numcomments - 1)
    }
    return (
        <div className="py-2 shadow-md rounded-md w-full bg-background flex flex-col gap-3">
            <Header data={data.data} deletepost={deletepost} />
            <Body content={data.data} />
            <div className="px-6">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row gap-1">
                        <div className="flex flex-row gap-2 items-center text-sm p-2">
                            <Image src={like} alt="like" width={18} height={18} />
                            {
                                numlikes
                            }
                        </div>
                        <div className="flex flex-row gap-2 items-center text-sm p-2">
                            <Image src={dislike} alt="dislike" width={18} height={18} />
                            {
                                numdislikes
                            }
                        </div>
                    </div>
                    <div className="flex items-center text-[14px] text-gray-400">
                        {numcomments} bình luận
                    </div>
                </div>
                <hr className="h-[1px] bg-slate-200" />
                <div className="flex flex-row justify-between py-2">
                    <div className="flex flex-row gap-6">
                        <div onClick={() => handleReactionPost("likepost")} className={`flex ${reaction === "likepost" ? "text-blue-400 bg-secondary" : "hover:bg-secondary"} flex-row gap-2 items-center text-sm rounded-md cursor-pointer p-2`}>
                            <Image src={like} alt="like" width={18} height={18} />
                            Thích
                        </div>
                        <div onClick={() => handleReactionPost("dislikepost")} className={`flex ${reaction === "dislikepost" ? "text-blue-400 bg-secondary" : "hover:bg-secondary"} flex-row gap-2 items-center text-sm rounded-md cursor-pointer p-2`}>
                            <Image src={dislike} alt="dislike" width={18} height={18} />
                            Không thích
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center text-sm hover:bg-secondary rounded-md cursor-pointer p-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="flex gap-2 items-center">
                                    <FaRegComment />
                                    Bình luận
                                </div>
                            </DialogTrigger>
                            <DialogContent className="overflow-y-scroll max-h-[600px] max-w-[600px] p-0 scrollbar">
                                <div className="flex flex-col gap-3 mt-8">
                                    <Header data={data.data} deletepost={deletepost} />
                                    <Body content={data.data} />
                                    {/* <div className="flex justify-between">
                                        <div className="flex flex-row gap-6 px-6">
                                            <div className="flex flex-row gap-2 items-center text-sm hover:bg-secondary rounded-md cursor-pointer p-2">
                                                <Image src={like} alt="like" width={18} height={18} />
                                                Thích
                                            </div>
                                            <div className="flex flex-row gap-2 items-center text-sm hover:bg-secondary rounded-md cursor-pointer p-2">
                                                <Image src={dislike} alt="dislike" width={18} height={18} />
                                                Không thích
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="mx-4 flex gap-2">
                                        <div>
                                            <Avatar>
                                                <AvatarImage src={user.avatar} alt="@shadcn" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col items-end w-full border border-gray-400 rounded-md pr-2 pb-2">
                                            <div className="w-full h-fit justify-between flex flex-row items-center">
                                                <Input className="outline-0 border-0 w-[90%] focus-visible:ring-transparent my-1 mx-2" value={comment} onChange={(e: any) => setComment(e.target.value)} placeholder="Viết câu trả lời..."
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleComment();
                                                        }
                                                    }}>
                                                </Input>
                                                <div className="w-[10%] flex justify-center items-center gap-2">
                                                    <Popover modal={true}>
                                                        <PopoverTrigger>
                                                            <MdOutlineEmojiEmotions className="text-2xl" />
                                                        </PopoverTrigger>
                                                        <PopoverContent className="">
                                                            <EmojiPicker width="100%" onEmojiClick={onEmojiClick} />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>
                                            <IoSend className="cursor-pointer mr-4 mt-2" onClick={handleComment} />
                                        </div>
                                    </div>
                                    <div className="mx-4">
                                        {
                                            isLoading ?
                                                <div className="border border-gray-400 shadow rounded-md p-4 w-full">
                                                    <div className="animate-pulse flex space-x-4">
                                                        <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                                                        <div className="flex-1 space-y-6 py-1">
                                                            <div className="h-2 bg-slate-200 rounded"></div>
                                                            <div className="space-y-3">
                                                                <div className="grid grid-cols-3 gap-4">
                                                                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                                                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                                                                </div>
                                                                <div className="h-2 bg-slate-200 rounded"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : ""
                                        }
                                    </div>
                                    <div className="mb-4 flex flex-col-reverse gap-3">
                                        {
                                            comments && comments.map((comment: any, index: any) => {
                                                return (
                                                    <Comment props={comment} key={index} id={data.data._id} addcomment={addcomment} deletecomment={deletecomment} />
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    )
}