"use client"
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RiSearchLine } from "react-icons/ri";
import axios from "axios";
import { IoVolumeMedium } from "react-icons/io5";
export default function Dictionary() {
    const [word, setWord] = useState("");
    const [status, setStatus] = useState<boolean>(false);
    const [result, setResult] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    async function handleSearch() {
        try {
            setIsLoading(true)
            const result = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            setStatus(true)
            setResult(result.data[0])
            setIsLoading(false)
        }
        catch (err) {
            setStatus(false)
            setIsLoading(false)
        }
    }
    const audioRef = useRef<HTMLAudioElement>(null);
    const handleAudioClick = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
    };
    return (
        <div className="rounded-md px-6 pt-2 pb-6 bg-background shadow-md flex flex-col gap-2 mb-12">
            <div className="font-semibold">
                Từ điển
            </div>
            <div className="flex flex-row gap-2">
                <Input onChange={(event) => setWord(event.target.value)} placeholder="Nhập từ cần tra" onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch();
                    }
                }} />
                <Button className="p-4" onClick={handleSearch} disabled={isLoading}>{
                    isLoading ?
                        <div className="w-5 h-5">
                            <svg className="animate-spin w-6 h-6 fill-blue-500" viewBox="3 3 18 18">
                                <path className="opacity-20" d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
                                </path>
                                <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z">
                                </path>
                            </svg>
                        </div>
                        : <RiSearchLine className="h-5 w-5" />
                }
                </Button>
            </div>
            {
                status === false && result != null && "Thông tin không tồn tại"
            }
            {
                status && result !== undefined && <audio ref={audioRef} src={result?.phonetics[0]?.audio} />
            }
            {
                status && <div>
                    <div className="mt-2 font-bold text-2xl flex items-center justify-between">
                        {result.word}
                        <div className="rounded-md p-2 hover:bg-secondary cursor-pointer transition duration-300" onClick={handleAudioClick}><IoVolumeMedium className="text-xl" /></div>
                    </div>
                    <div className="flex items-center">
                        {result?.phonetic && <div>
                            Pronunciation: {result?.phonetic}
                        </div>}
                    </div>
                    <div>
                        {
                            result.meanings.map((item: any, index: any) => {
                                return (
                                    <div key={index}>
                                        <div className="italic my-2 underline underline-offset-4">
                                            {item.partOfSpeech}
                                        </div>
                                        <div>
                                            {
                                                item.definitions.map((defitem: any, defindex: any) => {
                                                    return (
                                                        <div key={defindex}>
                                                            <div className="font mb-1 text-md flex items-center">
                                                                <div className="w-2 h-2 rounded-full bg-black mr-2" />Definition:
                                                            </div>
                                                            <div className="italic ml-4 pl-2 border-l-[2px] border-blue-300 text-sm border-h-[80%]">
                                                                {defitem.definition}
                                                            </div>
                                                            {
                                                                defitem.example && (
                                                                    <>
                                                                        <div className="font mb-1 flex items-center">
                                                                            <div className="w-2 h-2 rounded-full bg-black mr-2" /> Example:
                                                                        </div>
                                                                        <div className="italic">
                                                                            {defitem.example}
                                                                        </div>
                                                                    </>
                                                                )
                                                            }
                                                            {
                                                                defitem.antonyms.length > 0 && (
                                                                    <>
                                                                        <div className="font mb-1">
                                                                            Antonyms:
                                                                        </div>
                                                                        <div className="italic">
                                                                            {
                                                                                defitem.antonyms && defitem.antonyms.map((antonym: any, antindex: any) => {
                                                                                    if (antindex !== defitem.antonyms.length - 1) return (
                                                                                        <span className="text-sm" key={antindex}>
                                                                                            {antonym},
                                                                                        </span>
                                                                                    )
                                                                                    else return (
                                                                                        <span className="text-sm" key={antindex}>
                                                                                            {" "}{antonym}
                                                                                        </span>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </>
                                                                )
                                                            }
                                                            {
                                                                defitem.synonyms.length > 0 && (
                                                                    <>
                                                                        <div className="font mb-1">
                                                                            Synonyms:
                                                                        </div>
                                                                        <div className="italic">
                                                                            {
                                                                                defitem.synonyms && defitem.synonyms.map((synonym: any, synindex: any) => {
                                                                                    if (synindex !== defitem.synonyms.length - 1) return (
                                                                                        <span className="text-sm" key={synindex}>
                                                                                            {synonym}, {" "}
                                                                                        </span>
                                                                                    )
                                                                                    else return (
                                                                                        <span className="text-sm" key={synindex}>
                                                                                            {synonym}
                                                                                        </span>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }
        </div>
    )
}