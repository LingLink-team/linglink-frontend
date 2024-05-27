"use client";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TfiMoreAlt } from "react-icons/tfi";
import Image from "next/image";
import dislike from "@/app/assets/images/3670156.png";
import like from "@/app/assets/images/download.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaRegComment } from "react-icons/fa";
import Comment from "../comments/comment";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import AudioPlayer from "react-h5-audio-player";
import { IoSend } from "react-icons/io5";
import {
  CommentService,
  PostService,
  ProgressService,
  ReactionService,
} from "@/app/services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/app/redux/store";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import UpdatePost from "@/app/[locale]/(homepage)/components/updatepost";
import { motion } from "framer-motion";
import { EmojiPicker } from "@/components/chat/emoji-picker";
import { Textarea } from "../ui/textarea";
import Link from "next/link";
import { ReactionsModal } from "../reactionsModal";
import { useSocketStore } from "@/app/store/socketStore";

const Header = ({ data, deletepost }: { data: any; deletepost: any }) => {
  const user = useAppSelector((state) => state.auth.userinfor);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const handleDeletePost = async () => {
    if (user._id === data.author._id) {
      await PostService.deletePost(data._id);
      toast.success("Xóa bài viết thành công");
      deletepost(data._id);
    } else {
      toast.warn("Chỉ có tác giả của bài viết mới có thể xóa");
    }
  };
  const handleUpdate = () => {
    if (data.author._id === user._id) {
      setIsUpdate(true);
    } else toast.warn("Không có quyền chỉnh sửa");
  };
  return (
    <>
      <div className="flex flex-row justify-between px-6 items-center">
        <div className="flex flex-row items-center gap-3">
          <div>
            <Link href={`/profile/${data.author._id}`}>
              <Avatar>
                <AvatarImage src={data.author.avatar} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
          </div>
          <div>
            <div className="font-semibold">{data.author.name}</div>
            <div className="text-[13px] font-semibold text-primary">
              Chủ đề: {data.topic.topicName}
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div>
            <div className="text-stone-500 text-sm">
              {format(new Date(data.createdAt), "yyyy-MM-dd HH:mm:ss")}
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
                  <DropdownMenuItem onClick={handleUpdate}>
                    Chỉnh sửa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bạn có chắc chắn?</DialogTitle>
                  <DialogDescription>
                    Khi nhấn xác nhận sẽ xóa bài viết !
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="justify-end w-full">
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
      {isUpdate && (
        <UpdatePost
          data={data}
          isOpenModal={isUpdate}
          setIsOpenModal={setIsUpdate}
        />
      )}
    </>
  );
};

const Body = ({ content }: { content: any }) => {
  const queryClient = useQueryClient();
  const handleAnswer = async (idx: number) => {
    if (idx === content.question.key) {
      const res = await ProgressService.updateQuestion(
        content.question._id,
        true
      );
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    } else {
      const res = await ProgressService.updateQuestion(
        content.question._id,
        false
      );
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    }
  };
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="px-6">{content.content}</div>
      {content.imgs_url && (
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={10}
          slidesPerView={"auto"}
          navigation={true}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
        >
          {content.imgs_url &&
            content.imgs_url.map((img: any, index: any) => (
              <SwiperSlide className="!flex justify-center" key={index}>
                <Image
                  className="w-fit h-auto max-h-[500px]"
                  height={0}
                  width={0}
                  src={img}
                  alt="illustration"
                />
              </SwiperSlide>
            ))}
        </Swiper>
      )}
      {content?.question && (
        <div>
          <div className="px-6 text-lg font-semibold mb-4">
            Câu hỏi: {content.question.content}
          </div>
          {content.question?.audio_url && (
            <div className="px-6 mb-4">
              <AudioPlayer
                autoPlay={false}
                src={content.question.audio_url}
                className="w-full my-2"
              />
            </div>
          )}
          <div className="px-6 grid grid-cols-2 gap-3">
            {content.question.answers.map((answer: any, idx: any) => {
              return (
                <div className="w-full" key={idx}>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div
                        onClick={() => handleAnswer(idx)}
                        className="w-full h-full transition duration-300 hover:scale-[1.05] hover:bg-slate-200 cursor-pointer rounded-md border border-ring p-2 flex justify-center"
                        key={idx}
                      >
                        {answer}
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{`Câu hỏi: ${content.question.content}`}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {idx === content.question.key
                            ? "Chúc mừng bạn trả lời đúng"
                            : "Bạn đã trả lời sai, đừng nản chí, hãy thử lại"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Đóng</AlertDialogCancel>
                        {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const Post = ({ data, deletepost }: { data: any; deletepost: any }) => {
  const user = useAppSelector((state) => state.auth.userinfor);
  const queryClient = useQueryClient();
  const [id, setId] = useState<string>(data.data._id);
  const [reaction, setReaction] = useState<string>("");
  const [numlikes, setNumLikes] = useState<number>(data?.numlikes ?? 0);
  const [numdislikes, setNumDisLikes] = useState<number>(
    data?.numdislikes ?? 0
  );
  const [numcomments, setNumComments] = useState<number>(
    data?.data?.numComments ?? 0
  );

  const { data: comments, refetch } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const response = await CommentService.getComments(data.data._id);
      return response.data;
    },
    // keepPreviousData: true,
    // refetchOnWindowFocus: false,
    retry: false,
  });

  const [comment, setComment] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleComment = async () => {
    try {
      setIsLoading(true);
      const commentToCreate = {
        content: comment,
        post: data.data._id,
      };
      await CommentService.createComment(commentToCreate);
      if (data.data.author._id !== user._id) {
        sk?.emit("send-notification", {
          receiver: data.data.author._id,
          title: " đã bình luận bài viết của bạn",
          content: comment,
        });
        queryClient.invalidateQueries({ queryKey: ["notification"] });
      }
      setNumComments(numcomments + 1);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
    }
  };
  const { socket: sk } = useSocketStore();
  const handleReactionPost = async (type: string) => {
    try {
      if (reaction != type && data.data.author._id !== user._id) {
        sk?.emit("send-notification", {
          receiver: data.data.author._id,
          title:
            " đã " +
            (type == "likepost" ? "thích" : "không thích") +
            " bài viết của bạn",
          content: "",
        });
        queryClient.invalidateQueries({ queryKey: ["notification"] });
      }
      if (type === "likepost") {
        if (reaction === "likepost") {
          setNumLikes(numlikes - 1);
          setReaction("");
        } else {
          setNumLikes(numlikes + 1);
          setReaction("likepost");
          if (reaction == "dislikepost") setNumDisLikes(numdislikes - 1);
        }
      } else if (type === "dislikepost") {
        if (reaction === "dislikepost") {
          setNumDisLikes(numdislikes - 1);
          setReaction("");
        } else {
          setNumDisLikes(numdislikes + 1);
          setReaction("dislikepost");
          if (reaction == "likepost") setNumLikes(numlikes - 1);
        }
      }
      await ReactionService.reactionPost(type, id);
      refetchReactions();
      // queryClient.invalidateQueries({ queryKey: ['reactions', id] });
    } catch (error: any) {}
  };

  useEffect(() => {
    refetch();
    if (data.like) setReaction("likepost");
    if (data.dislike) setReaction("dislikepost");
  }, []);

  const addcomment = async () => {
    setNumComments(numcomments + 1);
  };
  const deletecomment = async () => {
    setNumComments(numcomments - 1);
  };

  const { data: reactions, refetch: refetchReactions } = useQuery({
    queryKey: ["reactions", data.data._id],
    queryFn: async () => {
      const reactions = await ReactionService.getReactionPost(data.data._id);
      return reactions.data;
    },
  });

  const [isOpenReactions, setIsOpenReactions] = useState<boolean>(false);

  return (
    <div className="py-2 shadow-md rounded-md w-full bg-background flex flex-col gap-3">
      <Header data={data.data} deletepost={deletepost} />
      <Body content={data.data} />
      <div className="px-6">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-1">
            <div className="flex flex-row gap-2 items-center text-sm p-2 cursor-pointer">
              <Image
                onClick={() => setIsOpenReactions(true)}
                src={like}
                alt="like"
                width={18}
                height={18}
              />
              {numlikes}
            </div>
            <div className="flex flex-row gap-2 items-center text-sm p-2 cursor-pointer">
              <Image
                onClick={() => setIsOpenReactions(true)}
                src={dislike}
                alt="dislike"
                width={18}
                height={18}
              />
              {numdislikes}
            </div>
          </div>
          <div className="flex items-center text-[14px] text-gray-400">
            {numcomments} bình luận
          </div>
        </div>
        <ReactionsModal
          isOpen={isOpenReactions}
          onOpenChange={setIsOpenReactions}
          reactions={reactions}
        />
        <hr className="h-[1px] bg-slate-200" />
        <div className="flex flex-row justify-between py-2">
          <div className="flex flex-row gap-6">
            <div
              onClick={() => handleReactionPost("likepost")}
              className={`flex ${
                reaction === "likepost"
                  ? "text-blue-400 bg-secondary"
                  : "hover:bg-secondary"
              } flex-row gap-2 items-center text-sm rounded-md cursor-pointer p-2`}
            >
              <Image src={like} alt="like" width={18} height={18} />
              Thích
            </div>
            <div
              onClick={() => handleReactionPost("dislikepost")}
              className={`flex ${
                reaction === "dislikepost"
                  ? "text-blue-400 bg-secondary"
                  : "hover:bg-secondary"
              } flex-row gap-2 items-center text-sm rounded-md cursor-pointer p-2`}
            >
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
                  <div className="mx-4 flex gap-2 mt-6">
                    <div>
                      <Avatar>
                        <AvatarImage src={user.avatar} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="w-full h-fit justify-between flex flex-row items-center px-4">
                      <motion.div
                        key="input"
                        className="w-full relative"
                        layout
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1 }}
                        transition={{
                          opacity: { duration: 0.05 },
                          layout: {
                            type: "spring",
                            bounce: 0.15,
                          },
                        }}
                      >
                        <Textarea
                          autoComplete="off"
                          ref={inputRef}
                          name="message"
                          className="col-span-3 outline-0 pr-8"
                          value={comment}
                          onChange={(e: any) => setComment(e.target.value)}
                          placeholder="Viết câu trả lời..."
                        ></Textarea>
                        <div className="absolute right-4 top-2">
                          <EmojiPicker
                            onChange={(value) => {
                              setComment(comment + value);
                              if (inputRef.current) {
                                inputRef.current.focus();
                              }
                            }}
                          />
                        </div>
                        <IoSend
                          className="absolute cursor-pointer mr-4 mt-2 top-8 right-0"
                          onClick={handleComment}
                        />
                      </motion.div>
                    </div>
                  </div>
                  <div className="mx-4">
                    {isLoading ? (
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
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="mb-4 flex flex-col-reverse gap-3">
                    {comments &&
                      comments.map((comment: any) => {
                        return (
                          <Comment
                            props={comment}
                            key={data.data._id}
                            id={data.data._id}
                            addcomment={addcomment}
                            deletecomment={deletecomment}
                          />
                        );
                      })}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};
