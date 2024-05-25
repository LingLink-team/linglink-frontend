import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useAppSelector } from "@/app/redux/store";
import { toast } from "react-toastify";
import { CommentService, ReactionService } from "@/app/services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TbArrowForward } from "react-icons/tb";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { TfiMoreAlt } from "react-icons/tfi";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { EmojiPicker } from "@/components/chat/emoji-picker";
import { Textarea } from "../ui/textarea";
import { FaSave } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import like from "@/app/assets/images/download.svg";
import dislike from "@/app/assets/images/3670156.png";
import Image from "next/image";
import { ReactionsModal } from "../reactionsModal";
import Link from "next/link";
import { useSocketStore } from "@/app/store/socketStore";
function ChildComment({
  props,
  id,
  addcomment,
  deletecomment,
}: {
  props: any;
  id: any;
  addcomment: any;
  deletecomment: any;
}) {
  const user = useAppSelector((state) => state.auth.userinfor);
  const queryClient = useQueryClient();
  const [reaction, setReaction] = useState<string>("");
  useEffect(() => {
    if (props.like) setReaction("like");
    if (props.dislike) setReaction("dislike");
  }, []);
  const { socket: sk } = useSocketStore();
  const handleReaction = async (type: string) => {
    if (reaction != type) {
      sk?.emit("send-notification", {
        reciever: props.data.author._id,
        title: ' đã ' + (type=='like'?'thích':'không thích') + ' bình luận của bạn',
        content: ''
      });
    }
    if (type === "like") {
      if (reaction === "like") {
        setReaction("");
      } else {
        setReaction("like");
      }
    } else if (type === "dislike") {
      if (reaction === "dislike") {
        setReaction("");
      } else {
        setReaction("dislike");
      }
    }
    const response = await ReactionService.reactionComment(
      type,
      props.data._id
    );
    queryClient.invalidateQueries({ queryKey: ["childcomments", id] });
    refetchReactions()
  };
  const handleDelete = async () => {
    if (user._id === props.data.author._id) {
      await CommentService.deleteById(props.data._id);
      toast.success("Xóa bình luận thành công");
      queryClient.invalidateQueries({ queryKey: ["childcomments", id] });
      deletecomment();
    } else {
      toast.error("Không được quyền xóa bình luận này!");
    }
  };
  const { data: reactions, refetch: refetchReactions } = useQuery({
    queryKey: ["reactions", props.data._id],
    queryFn: async () => {
      const reactions = await ReactionService.getReactionComment(
        props.data._id
      );
      return reactions.data;
    },
  });

  const [isOpenReactions, setIsOpenReactions] = useState<boolean>(false);
  return (
    <div className="w-full">
      <div className="flex flex-row gap-3">
        <Link href={`/profile/${props.data.author._id}`}>
          <Avatar>
            <AvatarImage src={props.data.author.avatar} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="rounded-md p-2 bg-slate-50 w-full">
          <div className="flex justify-between items-center w-full">
            <div className="font-semibold">{props.data.author.name}</div>
            <div className="text-stone-500 text-xs mb-2 flex gap-2 items-center">
              {format(new Date(props.data.createdAt), "yyyy-MM-dd HH:mm:ss")}
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
                    <DialogFooter className="sm:justify-end">
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
          <div>{props.data.content}</div>
        </div>
      </div>
      <div className="px-12 flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-1">
          <div
            onClick={() => handleReaction("like")}
            className={`text-gray-600 ${
              reaction === "like" ? "!text-blue-400" : ""
            } text-[12px] font-bold hover:underline flex flex-row cursor-pointer gap-2 items-center p-2`}
          >
            Thích
          </div>
          <div
            onClick={() => handleReaction("dislike")}
            className={`text-gray-600 ${
              reaction === "dislike" ? "!text-blue-400" : ""
            } text-[12px] font-bold hover:underline flex flex-row cursor-pointer gap-2 items-center p-2`}
          >
            Không thích
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-1 items-center text-sm text-slate-400">
            <button
              onClick={() => setIsOpenReactions(true)}
              className="flex -space-x-1"
            >
              <Image
                className="relative z-[1] border-[1px] border-white rounded-full"
                src={like}
                alt="like"
                width={20}
                height={20}
              />
              <Image
                className="relative z-0 border-[1px] border-white rounded-full"
                src={dislike}
                alt="dislike"
                width={20}
                height={20}
              />
            </button>{" "}
            {props.numlikes + props.numdislikes}
          </div>
          <ReactionsModal
            isOpen={isOpenReactions}
            onOpenChange={setIsOpenReactions}
            reactions={reactions}
          />
        </div>
      </div>
    </div>
  );
}

export default function Comment({
  props,
  id,
  addcomment,
  deletecomment,
}: {
  props: any;
  id: any;
  addcomment: any;
  deletecomment: any;
}) {
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.userinfor);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [reaction, setReaction] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showChildComments, setShowChildComments] = useState<boolean>(false);
  const { data: childcomments } = useQuery({
    queryKey: ["childcomments", props.data._id],
    queryFn: async () => {
      const response = await CommentService.getCommentsByCommentId(
        props.data._id
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
  const { socket: sk } = useSocketStore();
  const handleReaction = async (type: string) => {
    if (reaction != type) {
      sk?.emit("send-notification", {
        reciever: props.data.author._id,
        title: ' đã ' + (type=='like'?'thích':'không thích') + ' bình luận của bạn',
        content: ''
      });
    }
    if (type === "like") {
      if (reaction === "like") {
        setReaction("");
      } else {
        setReaction("like");
      }
    } else if (type === "dislike") {
      if (reaction === "dislike") {
        setReaction("");
      } else {
        setReaction("dislike");
      }
    }
    await ReactionService.reactionComment(type, props.data._id);
    queryClient.invalidateQueries({ queryKey: ["comments", id] });
    refetchReactions();
  };
  const [iscomment, setIsComment] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const handleComment = async () => {
    setIsLoading(true);
    if (comment !== "") {
      const newComment = {
        content: comment,
        comment: props.data._id,
      };
      const result = await CommentService.createComment(newComment);
      sk?.emit("send-notification", {
        reciever: props.data.author._id,
        title: ' đã phản hồi bình luận của bạn',
        content: comment
      });
      setIsLoading(false);
      setComment("");
      setIsComment(false);
      addcomment();
      queryClient.invalidateQueries({
        queryKey: ["childcomments", props.data._id],
      });
    } else toast.warn("Chưa nhập câu trả lời !");
  };
  const handleDelete = async () => {
    if (user._id === props.data.author._id) {
      await CommentService.deleteById(props.data._id);
      toast.success("Xóa bình luận thành công !");
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      deletecomment();
    } else {
      toast.error("Không được quyền xóa bình luận này!");
    }
  };
  useEffect(() => {
    if (props.like) setReaction("like");
    if (props.dislike) setReaction("dislike");
  }, []);

  const [oriComment, setOriComment] = useState<string>(props.data.content);
  const [changeComment, setChangeComment] = useState(props.data.content);
  const [isChangeComment, setIsChangeComment] = useState(false);
  const handleChangeComment = () => {
    if (props.data.author._id === user._id) {
      setIsChangeComment(true);
    } else toast.warn("Không có quyền chỉnh sửa");
  };
  const doChangeComment = async () => {
    const res = await CommentService.updateCommentsByCommentId(
      props.data._id,
      changeComment
    );
    toast.success("Cập nhật thành công");
    setIsChangeComment(false);
    setOriComment(changeComment);
  };

  const closeChangeComment = () => {
    setIsChangeComment(false);
    setChangeComment(props.data.content);
  };

  const { data: reactions, refetch: refetchReactions } = useQuery({
    queryKey: ["reactions", props.data._id],
    queryFn: async () => {
      const reactions = await ReactionService.getReactionComment(
        props.data._id
      );
      return reactions.data;
    },
  });

  const [isOpenReactions, setIsOpenReactions] = useState<boolean>(false);
  return (
    <div className="px-6">
      <div className="flex flex-row gap-3">
        <div className="mt-2">
          <Link href={`/profile/${props.data.author._id}`}>
            <Avatar>
              <AvatarImage src={props.data.author.avatar} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <div className="rounded-md p-2 bg-slate-50 w-full">
          <div className="flex justify-between items-center w-full">
            <div className="font-semibold">{props.data.author.name}</div>
            <div className="text-stone-500 text-xs mb-2 flex flex-row items-center gap-2">
              {format(new Date(props.data.createdAt), "yyyy-MM-dd HH:mm:ss")}
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
                      <DropdownMenuItem onClick={handleChangeComment}>
                        Chỉnh sửa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bạn có chắc chắn?</DialogTitle>
                      <DialogDescription>
                        Khi nhấn xác nhận sẽ xóa bình luận !
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end">
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
          {isChangeComment ? (
            <div>
              <div className="relative">
                <Textarea
                  className="pr-8"
                  onChange={(e: any) => setChangeComment(e.target.value)}
                  value={changeComment}
                />
                <div className="absolute right-4 top-2">
                  <EmojiPicker
                    onChange={(value) => {
                      setChangeComment(changeComment + value);
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="mt-3 ml-2 flex items-center gap-2">
                <button>
                  <FaSave onClick={doChangeComment} />
                </button>
                <button>
                  <IoMdClose onClick={closeChangeComment} />
                </button>
              </div>
            </div>
          ) : (
            <div>{oriComment}</div>
          )}
        </div>
      </div>
      <div className="px-12 flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-1">
          <div
            onClick={() => handleReaction("like")}
            className={`text-gray-600 ${
              reaction === "like" ? "!text-blue-400" : ""
            } text-[12px] font-bold hover:underline flex flex-row cursor-pointer gap-2 items-center p-2`}
          >
            Thích
          </div>
          <div
            onClick={() => handleReaction("dislike")}
            className={`text-gray-600 ${
              reaction === "dislike" ? "!text-blue-400" : ""
            } text-[12px] font-bold hover:underline flex flex-row cursor-pointer gap-2 items-center p-2`}
          >
            Không thích
          </div>
          <div
            onClick={() => setIsComment(!iscomment)}
            className="text-[12px] font-bold hover:underline flex items-center cursor-pointer text-gray-600"
          >
            Phản hồi
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-1 items-center text-sm text-slate-400">
            <button
              onClick={() => setIsOpenReactions(true)}
              className="flex -space-x-1"
            >
              <Image
                className="relative z-[1] border-[1px] border-white rounded-full"
                src={like}
                alt="like"
                width={20}
                height={20}
              />
              <Image
                className="relative z-0 border-[1px] border-white rounded-full"
                src={dislike}
                alt="dislike"
                width={20}
                height={20}
              />
            </button>{" "}
            {props.numlikes + props.numdislikes}
          </div>
          <ReactionsModal
            isOpen={isOpenReactions}
            onOpenChange={setIsOpenReactions}
            reactions={reactions}
          />
        </div>
      </div>
      <div>
        {showChildComments ? (
          <div className="w-full">
            {childcomments.map((item: any, key: any) => (
              <div className="flex gap-2 items-start w-full pl-4" key={key}>
                <TbArrowForward />
                <ChildComment
                  props={item}
                  id={props.data._id}
                  addcomment={addcomment}
                  deletecomment={deletecomment}
                />
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
        {isLoading ? (
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
        ) : (
          ""
        )}
        {!showChildComments && childcomments?.length > 0 ? (
          <div
            onClick={() => setShowChildComments(true)}
            className="flex gap-1 items-center cursor-pointer font-semibold hover:underline text-gray-600 ml-12 text-[14px]"
          >
            <TbArrowForward />
            Xem {childcomments?.length ?? 0} phản hồi
          </div>
        ) : (
          ""
        )}
      </div>
      {iscomment ? (
        <div className="flex gap-2 ml-4">
          <div>
            <Avatar>
              <AvatarImage src={user.avatar} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col items-end w-full rounded-md pb-2">
            <div className="w-full h-fit justify-between flex flex-row items-center">
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
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
