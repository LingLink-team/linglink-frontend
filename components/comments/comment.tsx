import { format } from 'date-fns';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import EmojiPicker from 'emoji-picker-react';
import { IoSend } from 'react-icons/io5';
import { useAppSelector } from '@/app/redux/store';
import { toast } from "react-toastify"
import { CommentService, ReactionService } from '@/app/services';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TbArrowForward } from "react-icons/tb";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { TfiMoreAlt } from 'react-icons/tfi';
import { Button } from '../ui/button';

function ChildComment({ props, id, addcomment, deletecomment }: { props: any, id: any, addcomment: any, deletecomment: any }) {
    const user = useAppSelector(state => state.auth.userinfor)
    const queryClient = useQueryClient();
    const [reaction, setReaction] = useState<string>("")
    useEffect(() => {
        if (props.like) setReaction("like")
        if (props.dislike) setReaction("dislike")
    }, [])
    const handleReaction = async (type: string) => {
        if (type === "like") {
            if (reaction === "like") {
                setReaction("")
            }
            else {
                setReaction("like")
            }
        }
        else if (type === "dislike") {
            if (reaction === "dislike") {
                setReaction("")
            }
            else {
                setReaction("dislike")
            }
        }
        const response = await ReactionService.reactionComment(type, props.data._id)
        console.log('Reaction đã được tạo thành công:', response);
        queryClient.invalidateQueries({ queryKey: ['childcomments', id] });
    }
    const handleDelete = async () => {
        console.log(user._id, props.data)
        if (user._id === props.data.author._id) {
            await CommentService.deleteById(props.data._id)
            toast.success("Xóa bình luận thành công")
            queryClient.invalidateQueries({ queryKey: ['childcomments', id] });
            deletecomment()
        }
        else {
            toast.error("Không được quyền xóa bình luận này!")
        }
    }
    return (
        <div className="w-full">
            <div className="flex flex-row gap-3">
                <Avatar>
                    <AvatarImage src={props.data.author.avatar} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="rounded-md p-2 bg-slate-50 w-full">
                    <div className="flex justify-between items-center w-full">
                        <div className="font-semibold">
                            {props.data.author.name}
                        </div>
                        <div className="text-stone-500 text-xs mb-2 flex gap-2 items-center">
                            {format(new Date(props.data.createdAt), 'yyyy-MM-dd HH:mm:ss')}
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
                                                Khi nhấn xác nhận sẽ xóa bình luận !
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="sm:justify-start">
                                            <DialogClose asChild>
                                                <Button onClick={handleDelete} type="button">
                                                    Xác nhận
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                    <div>
                        {props.data.content}
                    </div>
                </div>
            </div>
            <div className="px-12 flex flex-row gap-4">
                <div className="flex flex-row gap-1">
                    <div onClick={() => handleReaction("like")} className={`text-gray-600  ${reaction === "like" ? "!text-blue-400" : ""} text-[12px] font-bold hover:underline flex flex-row cursor-pointer gap-2 items-center p-2`}>
                        Thích
                    </div>
                    <div onClick={() => handleReaction("dislike")} className={`text-gray-600  ${reaction === "dislike" ? "!text-blue-400" : ""} text-[12px] font-bold hover:underline flex flex-row cursor-pointer gap-2 items-center p-2`}>
                        Không thích
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Comment({ props, id, addcomment, deletecomment }: { props: any, id: any, addcomment: any, deletecomment: any }) {
    const queryClient = useQueryClient();
    const user = useAppSelector(state => state.auth.userinfor)
    const [reaction, setReaction] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showChildComments, setShowChildComments] = useState<boolean>(false)
    const { data: childcomments, isFetching } = useQuery({
        queryKey: ['childcomments', props.data._id],
        queryFn: async () => {
            const response = await CommentService.getCommentsByCommentId(props.data._id)
            console.log("Child comments", response)
            return response.data;
        },
        refetchOnWindowFocus: false,
        retry: false
    });
    const handleReaction = async (type: string) => {
        if (type === "like") {
            if (reaction === "like") {
                setReaction("")
            }
            else {
                setReaction("like")
            }
        }
        else if (type === "dislike") {
            if (reaction === "dislike") {
                setReaction("")
            }
            else {
                setReaction("dislike")
            }
        }
        const response = await ReactionService.reactionComment(type, props.data._id)
        console.log('Reaction đã được tạo thành công:', response);
        queryClient.invalidateQueries({ queryKey: ['comments', id] });
    }
    const [iscomment, setIsComment] = useState<boolean>(false)
    const [comment, setComment] = useState<string>("")
    const onEmojiClick = (emojiObject: any, event: any) => {
        setComment((prevInput) => prevInput + emojiObject.emoji);
    };
    const handleComment = async () => {
        setIsLoading(true)
        if (comment !== "") {
            const newComment = {
                content: comment,
                comment: props.data._id
            }
            const result = await CommentService.createComment(newComment)
            console.log("Vừa trả lời bình luận", result)
            setIsLoading(false)
            setComment("")
            setIsComment(false)
            addcomment()
            queryClient.invalidateQueries({ queryKey: ['childcomments', props.data._id] });
        } else toast.warn("Chưa nhập câu trả lời !")
    }
    const handleDelete = async () => {
        if (user._id === props.data.author._id) {
            await CommentService.deleteById(props.data._id)
            toast.success("Xóa bình luận thành công !")
            console.log("ID", id)
            queryClient.invalidateQueries({ queryKey: ['comments', id] });
            deletecomment()
        }
        else {
            toast.error("Không được quyền xóa bình luận này!")
        }
    }
    useEffect(() => {
        if (props.like) setReaction("like")
        if (props.dislike) setReaction("dislike")
    }, [])
    return (
        <div className="px-6">
            <div className="flex flex-row gap-3">
                <div>
                    <Avatar>
                        <AvatarImage src={props.data.author.avatar} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div className="rounded-md p-2 bg-slate-50 w-full">
                    <div className="flex justify-between items-center w-full">
                        <div className="font-semibold">
                            {props.data.author.name}
                        </div>
                        <div className="text-stone-500 text-xs mb-2 flex flex-row items-center gap-2">
                            {format(new Date(props.data.createdAt), 'yyyy-MM-dd HH:mm:ss')}
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
                                                Khi nhấn xác nhận sẽ xóa bình luận !
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="sm:justify-start">
                                            <DialogClose asChild>
                                                <Button onClick={handleDelete} type="button">
                                                    Xác nhận
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                    <div>
                        {props.data.content}
                    </div>
                </div>
            </div>
            <div className="px-12 flex flex-row gap-4">
                <div className="flex flex-row gap-1">
                    <div onClick={() => handleReaction("like")} className={`text-gray-600 ${reaction === "like" ? "!text-blue-400" : ""} text-[12px] font-bold hover:underline flex flex-row cursor-pointer gap-2 items-center p-2`}>
                        Thích
                    </div>
                    <div onClick={() => handleReaction("dislike")} className={`text-gray-600 ${reaction === "dislike" ? "!text-blue-400" : ""} text-[12px] font-bold hover:underline flex flex-row cursor-pointer gap-2 items-center p-2`}>
                        Không thích
                    </div>
                </div>
                <div onClick={() => setIsComment(!iscomment)} className="text-[12px] font-bold hover:underline flex items-center cursor-pointer text-gray-600">
                    Phản hồi
                </div>
            </div>
            <div>
                {
                    showChildComments ?
                        <div className="w-full">
                            {
                                childcomments.map((item: any, key: any) => (
                                    <div className="flex gap-2 items-start w-full pl-4" key={key}>
                                        <TbArrowForward />
                                        <ChildComment props={item} id={props.data._id} addcomment={addcomment} deletecomment={deletecomment} />
                                    </div>
                                ))
                            }
                        </div>
                        : ""
                }
                {isLoading ?
                    <div className="w-full pl-8">
                        <div className="border border-gray-400 shadow rounded-md p-4 w-full my-2">
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
                    </div>
                    : ""}
                {
                    !showChildComments && childcomments?.length > 0 ?
                        <div onClick={() => setShowChildComments(true)} className="flex gap-1 items-center cursor-pointer font-semibold hover:underline text-gray-600 ml-12 text-[14px]">
                            <TbArrowForward />
                            Xem {childcomments?.length ?? 0} phản hồi
                        </div> : ""
                }
            </div>
            {
                iscomment ? <div className="flex gap-2 ml-4">
                    <div>
                        <Avatar>
                            <AvatarImage src={user.avatar} alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex flex-col items-end w-full border border-gray-400 rounded-md pb-2">
                        <div className="w-full h-fit justify-between flex flex-row items-center">
                            <Input className="outline-0 border-0 w-[90%] focus-visible:ring-transparent my-1 mx-2" value={comment} onChange={(e: any) => setComment(e.target.value)} placeholder="Viết câu trả lời..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleComment();
                                    }
                                }}
                            >
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
                </div> : ""
            }
        </div >
    )
}