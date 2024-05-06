"use client";

import { MdDelete } from "react-icons/md";
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
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "react-toastify";
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
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { PostService } from "@/app/services";
import { Icons } from "@/components/icons/icons";
import { uploadFile } from "@/utils";
import { FaEdit } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { EmojiPicker } from "@/components/chat/emoji-picker";

export default function UpdatePost({ data, isOpenModal, setIsOpenModal }: any) {
  const [input, setInput] = useState<string>(data.content);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [myFile, setMyFile] = useState(data.imgs_url);
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
  const removeFile = (removeFile: any) => {
    const updatedFiles = myFile.filter((file: any) => file !== removeFile);
    setMyFile(updatedFiles);
  };
  const files_image = myFile.map((fileOrUrl: any, index: number) => {
    if (fileOrUrl instanceof File) {
      const imageUrl = URL.createObjectURL(fileOrUrl);
      return (
        <li
          key={index}
          className="border-2 w-full px-4 py-3 flex gap-1 justify-between items-center rounded-md text-xs"
        >
          <Image
            width={0}
            height={0}
            src={imageUrl}
            alt={fileOrUrl.name}
            className="h-full max-h-[40px] w-fit"
          />
          <span className=" truncate">
            {fileOrUrl.name} - {fileOrUrl.size} bytes
          </span>
          <Button onClick={() => removeFile(fileOrUrl)} size="sm">
            <MdDelete />
          </Button>
        </li>
      );
    } else if (typeof fileOrUrl === "string") {
      return (
        <li
          key={index}
          className="border-2 w-full px-4 py-3 flex gap-1 justify-between items-center rounded-md text-xs"
        >
          <Image
            width={0}
            height={0}
            src={fileOrUrl}
            alt={`Image ${index}`}
            className="h-full max-h-[40px] w-fit"
          />
          <Button onClick={() => removeFile(fileOrUrl)} size="sm">
            <MdDelete />
          </Button>
        </li>
      );
    } else {
      return null; // Trường hợp khác (nếu có)
    }
  });
  const [answers, setAnswers] = useState(data.question?.answers ?? []); // State để theo dõi danh sách đáp án

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
  const [topic, setTopic] = useState<string>(data.topic._id);
  const [topics, setTopics] = useState<any>();
  const [question, setQuestion] = useState<string>(data.question?.content);
  const [audio, setAudio] = useState<any>("");
  const [audioFile, setAudioFile] = useState<any>(
    data.question?.audio_url ?? null
  );
  const [key, setKey] = useState<any>(data.question?.key);
  const [previewquestion, setPreviewQuestion] = useState<any>(
    data.question ?? null
  );
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

  const queryClient = useQueryClient();
  const updatePost = async () => {
    try {
      setIsLoading(true);

      let uploadedImages = [];
      let audioUrl = "";

      // Kiểm tra nếu các file đã được tải lên trước đó
      if (myFile.every((file: any) => typeof file === "string")) {
        // Nếu các file là URL sẵn, không cần upload
        uploadedImages = myFile;
      } else {
        // Nếu có file đang chờ upload, thực hiện upload
        const fileUploadPromises = myFile
          ? myFile.map((file: any) =>
              file ? uploadFile(file) : Promise.resolve(null)
            )
          : [Promise.resolve(null)];
        uploadedImages = await Promise.all(fileUploadPromises);
      }

      // Kiểm tra nếu file âm thanh đã được tải lên trước đó
      if (typeof audioFile === "string") {
        // Nếu file là URL sẵn, không cần upload
        audioUrl = audioFile;
      } else {
        // Nếu có file đang chờ upload, thực hiện upload
        audioUrl = await (audioFile
          ? uploadFile(audioFile)
          : Promise.resolve(null));
      }

      const updatedPreviewQuestion = {
        ...previewquestion,
        audio_url: audioUrl,
      };

      const postreq = {
        topic: topic,
        ...(previewquestion !== null && {
          question: updatedPreviewQuestion,
        }),
        content: input,
        imgs_url: uploadedImages,
      };

      let errors = {
        topic: "",
        content: "",
      };
      if (postreq.topic === "") errors.topic = "Chưa chọn topic";
      if (postreq.content === "")
        errors.content = "Chưa nhập nội dung bài viết";
      if (errors?.topic || errors?.content) {
        toast.warn("Bạn chưa chọn topic hoặc chưa nhập nội dung bài viết");
      } else {
        await PostService.updatePostById(data._id, postreq);
        toast.success("Chỉnh sửa bài viết thành công");
        clearInput();
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      console.log(err);
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
    <div className="">
      <div className="flex flex-row gap-3">
        <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
          {isLoading ? (
            <div className="flex gap-2 justify-center items-center bg-gray-100 hover:bg-slate-200 transition duration-300 cursor-pointer w-full rounded-2xl p-3 text-gray-400">
              <Icons.spinner className="mr-2 h-5 w-5 animate-spin" /> Đang tạo
              bài viết
            </div>
          ) : (
            <DialogTrigger asChild>
              <div className="hidden"></div>
            </DialogTrigger>
          )}
          <DialogContent className="overflow-y-scroll max-h-[80vh] no-scrollbar">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
              <DialogDescription>Chỉnh sửa thông tin và nhấn lưu để thay đổi</DialogDescription>
            </DialogHeader>
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
                      value={input}
                      ref={inputRef}
                      placeholder="Nhập nội dung bài viết"
                      onChange={(event) => setInput(event.target.value)}
                      name="message"
                      className="col-span-3"
                    ></Textarea>
                    <div className="absolute right-2 top-2">
                      <EmojiPicker
                        onChange={(value) => {
                          setInput(input + value);
                          if (inputRef.current) {
                            inputRef.current.focus();
                          }
                        }}
                      />
                    </div>
                  </motion.div>
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
                              src={
                                typeof audioFile === "string"
                                  ? audioFile
                                  : URL.createObjectURL(audioFile)
                              }
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
                            {answers.map((answer: any, index: number) => (
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
                            Lưu câu hỏi
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </div>
                </div>
                <div>
                  {previewquestion && (
                    <div className="border px-2 py-4 rounded-lg">
                      <div>
                        <div className="text-md font-semibold mb-4">
                          Câu hỏi: {previewquestion.content}
                        </div>
                        <div className="flex">
                          <DialogTrigger asChild>
                            <Button className="mb-4 bg-yellow-400" size="sm">
                              <FaEdit />
                            </Button>
                          </DialogTrigger>
                          <Button
                            className="ml-2 mb-4 bg-red-400"
                            size="sm"
                            onClick={deletequestion}
                          >
                            <MdDelete />
                          </Button>
                        </div>
                        {audioFile && (
                          <AudioPlayer
                            autoPlay={false}
                            src={
                              typeof audioFile === "string"
                                ? audioFile
                                : URL.createObjectURL(audioFile)
                            }
                            className="w-full my-2"
                          />
                        )}
                        <div className="px-6 grid grid-cols-2 gap-3 mt-6">
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
                  <ul className="flex flex-col gap-2">{files_image}</ul>
                </aside>
              </div>
            </Dialog>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={updatePost} className="mt-2" type="submit">
                  Chỉnh sửa
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
