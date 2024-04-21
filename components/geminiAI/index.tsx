"use client"
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useCallback, useState } from 'react';
import { Button } from '../ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from '../ui/input';
import { Icons } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import Image from "next/image";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAppSelector } from '@/app/redux/store';
import geminiimg from "@/app/assets/images/gemini.webp"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Message {
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    image?: string; // Thêm trường image
}


export default function ChatWithGemini() {
    // Access your API key as an environment variable (see "Set up your API key" above)
    const genAI = new GoogleGenerativeAI(`${process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY}`);
    const [question, setQuestion] = useState<string>("")
    const [mes, setMes] = useState<Message[]>([]);
    const [answer, setAnswer] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [myFile, setMyFile] = useState([]);
    const user = useAppSelector(state => state.auth.userinfor)
    const onDrop = useCallback(
        (acceptedFiles: any) => {
            setMyFile(acceptedFiles);
        },
        [myFile]
    );
    const { getRootProps: imageroot, getInputProps: image_inputprops } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.png', '.webp', '.heic', '.heif']
        },
        // maxFiles: 1,
        onDrop: onDrop
    });
    const removeFile = (filePath: string) => {
        const updatedFiles = myFile.filter((file: any) => file.path !== filePath);
        setMyFile(updatedFiles);
    }
    const files_image = myFile.map((file: any) => {
        // const imageUrl = URL.createObjectURL(file);
        return (
            < li key={file.path} className="border-2 w-full px-4 py-3 flex flex-row gap-1 justify-between items-center rounded-md text-xs">
                {/* <Image width={0} height={0} src={imageUrl} alt={file.name} className="h-full max-h-[120px] w-full" /> */}
                {file.path} - {file.size} bytes
                <Button onClick={() => removeFile(file.path)}>
                    Delete
                </Button>
            </li >
        )
    });
    async function fileToGenerativePart(file: File): Promise<any> {
        const base64EncodedDataPromise = new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result?.toString().split(',')[1] || "");
            reader.readAsDataURL(file);
        });

        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
    };

    const runGeminiVision = async () => {
        // For text-and-image input, use the gemini-pro-vision model
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        setIsLoading(true);

        const imageParts = await Promise.all(
            myFile.map(async (file) => {
                return fileToGenerativePart(file);
            })
        );

        const result = await model.generateContentStream([question, ...imageParts]);
        let text = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            text += chunkText;
            setAnswer(text);
        }
        setIsLoading(false);
        setQuestion("");
        setMyFile([])
        setMes(prevMes => [
            ...prevMes,
            {
                author: { name: user.name, avatar: user.avatar },
                content: question,
                image: myFile.length > 0 ? URL.createObjectURL(myFile[0]) : undefined,
            },
            {
                author: { name: 'Gemini AI', avatar: geminiimg.src },
                content: text,
            },
        ]);
    }

    const runGemini = async () => {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        setIsLoading(true);

        const result = await model.generateContentStream(question);
        let text = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            text += chunkText;
            setAnswer(text);
        }

        setIsLoading(false);
        setQuestion("");
        setMes(prevMes => [
            ...prevMes,
            {
                author: { name: user.name, avatar: user.avatar },
                content: question,
            },
            {
                author: { name: 'Gemini AI', avatar: geminiimg.src },
                content: text,
            },
        ]);
    }

    return (
        <div className="px-6 py-2 bg-background shadow-md rounded-md w-full">
            <div className="flex justify-center	pt-2">
                <Sheet >
                    <SheetTrigger asChild>
                        <Button className="mb-2">Chat với Gemini AI</Button>
                    </SheetTrigger>
                    <SheetContent side="top">
                        <SheetHeader>
                            <SheetTitle>Gemini AI</SheetTitle>
                            <SheetDescription>
                                Bạn hỏi Gemini trả lời.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="rounded-md border min-h-[200px] border-black p-4 my-2 bg-slate-50 overflow-y-auto max-h-[300px]">
                            {mes.map((message: any, index: any) => (
                                <div key={index} className={`mt-2 mb-8`}>
                                    <div className="flex flex-row gap-4 items-center">
                                        <Avatar>
                                            <AvatarImage className="cursor-pointer" src={message.author.avatar} alt="@shadcn" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div>{message.author.name}</div>
                                    </div>

                                    <div className="my-2 ml-2">
                                        {message.image && <Image src={message.image} width={0} height={0} alt="Uploaded" className="max-h-[200px] w-auto mb-2" />}
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="grid gap-4 py-4">
                            <div>
                                <div {...imageroot({ className: 'dropzone py-2 px-3 border border-ring flex justify-center border-dashed cursor-pointer rounded-md' })}>
                                    <input {...image_inputprops()} />
                                    <div className="flex flex-row gap-2 items-center justify-center">
                                        <div>
                                            Chọn hoặc kéo thả để thêm ảnh
                                        </div>
                                    </div>
                                </div>
                                <aside className="mt-2">
                                    <ul className="grid grid-cols-3 gap-4">{files_image}</ul>
                                </aside>
                            </div>
                            <div className="flex flex-row items-center gap-4">
                                <Input value={question} onChange={(e) => setQuestion(e.target.value)} id="question" placeholder='Nhập câu hỏi của bạn' className="w-[95%]" onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        (myFile.length === 0) ? runGemini() : runGeminiVision();
                                    }
                                }} />
                                <Button className="w-[5%]" onClick={(myFile.length === 0) ? runGemini : runGeminiVision} type="submit">
                                    {isLoading ? <Icons.spinner /> : <div>Gửi</div>}{" "}
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div >
    )
}
