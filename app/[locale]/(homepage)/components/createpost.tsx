"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { FaRegImages } from "react-icons/fa6";
import { BsPatchQuestionFill } from "react-icons/bs";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { PostService } from "@/app/services";
import { Icons } from "@/components/icons/icons";
import { useAppSelector } from "@/app/redux/store";
import { uploadFile } from "@/utils";

export default function CreatePost({ add }: { add: any }) {
  const user = useAppSelector((state) => state.auth.userinfor);

  const [input, setInput] = useState<string>("");
  const onEmojiClick = (emojiObject: any, event: any) => {
    setInput((prevInput) => prevInput + emojiObject.emoji);
  };
  const [myFile, setMyFile] = useState([]);
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      setMyFile(acceptedFiles);
    },
    [myFile]
  );
  const { getRootProps: imageroot, getInputProps: image_inputprops } =
    useDropzone({
      accept: {
        "image/*": [".jpeg", ".png"],
      },
      // maxFiles: 1,
      onDrop: onDrop,
    });
  const removeFile = (filePath: string) => {
    const updatedFiles = myFile.filter((file: any) => file.path !== filePath);
    setMyFile(updatedFiles);
  };
  const files_image = myFile.map((file: any) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <li
        key={file.path}
        className="border-2 w-full px-4 py-3 flex flex-col gap-1 justify-between items-center rounded-md text-xs"
      >
        <Image
          width={0}
          height={0}
          src={imageUrl}
          alt={file.name}
          className="h-full max-h-[120px] w-full"
        />
        {file.path} - {file.size} bytes
        <Button onClick={() => removeFile(file.path)}>Delete</Button>
      </li>
    );
  });
  const [answers, setAnswers] = useState(["", ""]); // State để theo dõi danh sách đáp án

  // Hàm thêm đáp án mới
  const addAnswer = () => {
    if (answers.length < 4) {
      setAnswers([...answers, ""]);
    }
  };

  // Hàm xóa đáp án
  const removeAnswer = (index: any) => {
    if (answers.length > 2) {
      const newAnswers = [...answers];
      newAnswers.splice(index, 1);
      setAnswers(newAnswers);
    } else toast.warn("Đáp án phải luôn lớn hơn 2");
  };

  // Hàm xử lý thay đổi giá trị của một ô điền đáp án
  const handleAnswerChange = (index: any, value: any) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };
  const listanswer = ["A", "B", "C", "D"];
  const [topic, setTopic] = useState<string>("");
  const [topics, setTopics] = useState<any>();
  const [question, setQuestion] = useState<string>("");
  const [audio, setAudio] = useState<any>("");
  const [audioFile, setAudioFile] = useState<any>(null);
  const [key, setKey] = useState<any>(null);
  const [previewquestion, setPreviewQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const clearInput = async () => {
    setTopic("");
    setQuestion("");
    setInput("");
    setAudio("");
    setAudioFile(null);
    setKey(null);
    setPreviewQuestion(null);
  };
  const createPost = async () => {
    try {
      setIsLoading(true);
      const fileUploadPromises = myFile
        ? myFile.map((file) =>
            file ? uploadFile(file) : Promise.resolve(null)
          )
        : [Promise.resolve(null)];

      const audioUploadPromise = audioFile
        ? uploadFile(audioFile)
        : Promise.resolve(null);

      const [uploadedImages, audioUrl] = await Promise.all([
        Promise.all(fileUploadPromises),
        audioUploadPromise,
      ]);

      const updatedPreviewQuestion = {
        ...previewquestion,
        audio_url: audioUrl,
      };

      const postreq = {
        topicID: topic,
        ...(previewquestion !== null && {
          newQuestion: updatedPreviewQuestion,
        }),
        content: input,
        imgs_url: uploadedImages,
      };
      // Tạo bài viết
      // const axiosJWT = createAxiosInstance()
      let errors = {
        topic: "",
        content: "",
      };
      if (postreq.topicID === "") errors.topic = "Chưa chọn topic";
      if (postreq.content === "")
        errors.content = "Chưa nhập nội dung bài viết";
      if (errors?.topic || errors?.content) {
        toast.warn("Bạn chưa chọn topic hoặc chưa nhập nội dung bài viết");
      } else {
        const result: any = await PostService.createPost(postreq);
        const newdata = {
          data: result.data,
        };
        add(newdata);
        toast.success("Thêm bài viết thành công");
        clearInput();
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      toast.error("Tạo bài viết thất bại");
    }
  };
  const addquestion = async () => {
    try {
      const questionreq = {
        content: question,
        answers: answers,
        key: key,
        audio_url: audioFile,
      };
      if (questionreq.content !== "" && !questionreq.answers.includes(""))
        setPreviewQuestion(questionreq);
      else toast.warn("Câu hỏi không hợp lệ");
      // setQuestion('')
      // setAnswers([])
      // setAudio(null)
    } catch (err: any) {
      toast.error("Thêm thất bại");
    }
  };
  const deletequestion = () => {
    setPreviewQuestion(null);
    setKey(null);
  };
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        let getTopics = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/topics`
        );
        setTopics(getTopics.data);
      } catch (err: any) {
        toast.error("Tải posts thất bại");
      }
    };
    fetchTopics();
  }, []);
  return (
    <div className="bg-background rounded-md px-6 pt-3 py-6 shadow-md">
      <div className="flex flex-row gap-3">
        <Avatar>
          <AvatarImage src={user.avatar} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Sheet>
          {isLoading ? (
            <div className="flex gap-2 justify-center items-center bg-gray-100 hover:bg-slate-200 transition duration-300 cursor-pointer w-full rounded-2xl p-3 text-gray-400">
              <Icons.spinner className="mr-2 h-5 w-5 animate-spin" /> Đang tạo
              bài viết
            </div>
          ) : (
            <SheetTrigger asChild>
              <div className="bg-gray-100 hover:bg-slate-200 transition duration-300 cursor-pointer w-full rounded-2xl p-3 text-gray-400">
                {user.name} à, Bạn đang nghĩ gì thế ?
              </div>
            </SheetTrigger>
          )}
          <SheetContent className="overflow-y-scroll max-h-screen" side="top">
            <SheetHeader>
              <SheetTitle>Tạo bài viết mới</SheetTitle>
              <SheetDescription>Bạn muốn tạo bài viết gì ?</SheetDescription>
            </SheetHeader>
            <Dialog>
              <div className="">
                <div className="flex flex-col gap-3 my-4">
                  <Select
                    value={topic}
                    onValueChange={(value) => setTopic(value)}
                  >
                    <Label
                      htmlFor="topic"
                      className="after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold text-left"
                    >
                      Chủ đề
                    </Label>
                    <SelectTrigger id="topic" className="w-[180px]">
                      <SelectValue placeholder="Chọn chủ đề" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Chủ đề</SelectLabel>
                        {topics &&
                          topics.map((topic: any, index: any) => {
                            return (
                              <SelectItem key={index} value={topic._id}>
                                {topic.topicName}
                              </SelectItem>
                            );
                          })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Label
                    htmlFor="content"
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold text-left"
                  >
                    Nội dung
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Nhập nội dung bài viết"
                    onChange={(event) => setInput(event.target.value)}
                    value={input}
                    className="col-span-3"
                  ></Textarea>
                  <div className="w-full justify-between flex">
                    {/* <Dialog> */}
                    <DialogTrigger asChild>
                      <Button variant="outline">Thêm câu hỏi</Button>
                    </DialogTrigger>
                    <DialogContent className="overflow-y-scroll max-h-screen max-w-[800px]">
                      <DialogHeader>
                        <DialogTitle>Thêm câu hỏi</DialogTitle>
                        <DialogDescription>
                          Tạo quiz bằng cách điền form bên dưới
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="question" className="text-right">
                            Câu hỏi
                          </Label>
                          <Input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            id="question"
                            placeholder="Viết câu hỏi"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="audio" className="text-right">
                            File ghi âm (nếu có):
                          </Label>
                          <Input
                            value={audio}
                            onChange={(e) =>
                              setAudioFile(
                                e.target.files ? e.target.files[0] : null
                              )
                            }
                            type="file"
                            id="audio"
                            placeholder="Chọn file ghi âm"
                            className="col-span-3"
                            accept=".mp3,audio/*"
                          />
                        </div>
                        {audioFile && (
                          <div className="items-center w-full">
                            <Label htmlFor="audio" className="text-right my-2">
                              File ghi âm đã chọn:
                            </Label>
                            <AudioPlayer
                              autoPlay={false}
                              src={URL.createObjectURL(audioFile)}
                              className="w-full my-2"
                            />
                            <Button
                              onClick={() => {
                                setAudio("");
                                setAudioFile(null);
                              }}
                            >
                              Xóa
                            </Button>
                          </div>
                        )}
                        <div>
                          <Label>Chọn đáp án</Label>
                          <Select onValueChange={(value) => setKey(value)}>
                            <SelectTrigger className="w-[200px] mt-2">
                              <SelectValue placeholder="Chọn đáp án" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>
                                  Chọn đáp án của đề bài
                                </SelectLabel>
                                {answers &&
                                  answers.map((item: any, idx: any) => {
                                    return (
                                      <SelectItem key={idx} value={idx}>
                                        {item}
                                      </SelectItem>
                                    );
                                  })}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <div className="flex flex-col gap-2 my-4">
                            {answers.map((answer, index) => (
                              <div
                                className="flex gap-4 items-center"
                                key={index}
                              >
                                <div className="font-bold">
                                  {listanswer[index]}.
                                </div>
                                <Input
                                  type="text"
                                  value={answer}
                                  onChange={(e) =>
                                    handleAnswerChange(index, e.target.value)
                                  }
                                />
                                {/* Hiển thị select chọn đáp án */}
                                {/* Nút xóa đáp án */}
                                <Button onClick={() => removeAnswer(index)}>
                                  Xóa
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Nút thêm đáp án */}
                        <Button onClick={addAnswer}>Thêm câu trả lời</Button>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={addquestion} type="submit">
                            Tạo câu hỏi
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                    {/* </Dialog> */}
                    <Popover modal={true}>
                      <PopoverTrigger>
                        <Button variant="outline">
                          <MdOutlineEmojiEmotions className="text-2xl" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="overflow-auto">
                        <EmojiPicker width="100%" onEmojiClick={onEmojiClick} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div>
                  {previewquestion !== null && (
                    <div>
                      <div>
                        <div className="px-6 text-lg font-semibold mb-4">
                          Câu hỏi: {previewquestion.content}
                        </div>
                        <div className="flex">
                          <DialogTrigger asChild>
                            <Button className="ml-6 mb-4">Sửa câu hỏi</Button>
                          </DialogTrigger>
                          <Button
                            className="ml-6 mb-4"
                            onClick={deletequestion}
                          >
                            Xóa câu hỏi
                          </Button>
                        </div>
                        <div className="px-6 grid grid-cols-2 gap-3">
                          {previewquestion.answers.map(
                            (answer: any, idx: any) => {
                              return (
                                <div className="w-full" key={idx}>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <div
                                        className="w-full h-full transition duration-300 hover:scale-[1.02] hover:bg-slate-200 cursor-pointer rounded-md border border-ring p-2 flex justify-center break-all"
                                        key={idx}
                                      >
                                        {answer}
                                      </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>{`Đáp án câu hỏi là: ${previewquestion.answers[key]}`}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          {idx === key
                                            ? "Chúc mừng bạn trả lời đúng"
                                            : "Bạn đã trả lời sai, đừng nản chí, hãy thử lại"}
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Đóng
                                        </AlertDialogCancel>
                                        {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-md font-semibold mt-2">Hình Ảnh</div>
                <div
                  {...imageroot({
                    className:
                      "dropzone py-5 px-3 border border-ring flex justify-center border-dashed cursor-pointer rounded-md",
                  })}
                >
                  <input {...image_inputprops()} />
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <p className="text-4xl font-medium">+</p>
                    <div>Thêm ảnh bằng cách nhấn chọn hoặc kéo thả</div>
                  </div>
                </div>
                <aside className="mt-2">
                  <ul className="grid grid-cols-6 gap-4">{files_image}</ul>
                </aside>
              </div>
            </Dialog>
            <SheetFooter>
              <SheetClose asChild>
                <Button onClick={createPost} className="mt-2" type="submit">
                  Tạo bài viết
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <hr className="h-[1px] mt-5 bg-gray-400"></hr>
      <div className="flex justify-between mt-4">
        <div className="basis-1/2 flex items-center gap-2 justify-center w-full hover:bg-slate-200 py-2 rounded-lg cursor-pointer transition duration-300">
          <FaRegImages className="text-green-500 text-2xl" />
          <div className="font-medium text-slate-400">Tải ảnh lên</div>
        </div>
        <div className="basis-1/2 flex items-center gap-2 justify-center w-full  hover:bg-slate-200 py-2 rounded-lg cursor-pointer transition duration-300">
          <BsPatchQuestionFill className="text-yellow-500 text-2xl" />
          <div className="font-medium text-slate-400">Đặt câu hỏi</div>
        </div>
      </div>
    </div>
  );
}
