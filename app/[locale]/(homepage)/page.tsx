"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Post } from "@/components/posts/post";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons/icons";
import CreatePost from "./components/createpost";
import createAxiosInstance from "@/app/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { TopicService } from "@/app/services";
import { toast } from "react-toastify";

const Filter: React.FC = () => {
  const [active, setActive] = useState<number>(0);
  const handleClick = (idx: number) => {
    if (active !== idx) {
      setActive(idx);
    }
  };
  return (
    <div className="flex gap-2">
      {/* <Button
        onClick={() => handleClick(0)}
        className={`${
          active === 0
            ? "bg-primary"
            : "bg-slate-200 text-black hover:bg-slate-300"
        }`}
      >
        Phổ biến nhất
      </Button>
      <Button
        onClick={() => handleClick(1)}
        className={`${
          active === 1
            ? "bg-primary"
            : "bg-slate-200 text-black hover:bg-slate-300"
        }`}
      >
        Mới nhất
      </Button> */}
    </div>
  );
};

const Home: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState<Date>();
  const [lastPostTime, setLastPostTime] = useState<Date>();
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const createpost = (post: any) => {
    setPosts((prev) => [post, ...prev]);
  };
  const axiosJWT = createAxiosInstance();

  const { refetch, isLoading } = useQuery({
    queryKey: ["posts", selectedTopic],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!isEnd) {
        let lastTime = null;
        if (posts && posts.length > 0) {
          lastTime = posts[posts.length - 1].data.createdAt;
          if (!lastPostTime) setLastPostTime(lastTime);
          else if (lastTime < lastPostTime) setLastPostTime(lastTime);
          else if (lastTime > lastPostTime) lastTime = lastPostTime;
        }
        const newData = await axiosJWT.get(
          `${process.env.NEXT_PUBLIC_BASE_URL_V2}/posts/page`,
          {
            params: {
              lastPostTime: lastTime,
              pageSize: 5,
              ...(selectedTopic !== "all" && { topic: selectedTopic }),
              lastFetchTime: lastFetchTime,
            },
          }
        );
        if (posts.length > 20 && newData.data.length > 0) {
          setPosts(() => {
            const updatedPosts = [...newData.data];
            return updatedPosts;
          });
        } else {
          setPosts((prevData) => {
            const updatedPosts = [...prevData, ...newData.data];
            return updatedPosts;
          });
          if (newData.data.length === 0) {
            setIsEnd(true);
            toast.warning("Đã đến post cuối cùng");
          }
        }
        setLastFetchTime(new Date());
        return newData.data;
      }
      return [];
    },
  });

  const { data: allTopics } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const topics = await TopicService.getAll();
      return topics?.data ?? [];
    },
  });

  useEffect(() => {
    const delay = 500;
    setLastPostTime(undefined);
    setLastFetchTime(undefined);
    setPosts([]);
    let timeoutId: any = "";
    if (isEnd) {
      setIsEnd(false);
    } else {
      timeoutId = setTimeout(() => {
        refetch();
      }, delay);
    }
    return () => clearTimeout(timeoutId);
  }, [selectedTopic]);

  useEffect(() => {
    refetch();
  }, [isEnd]);

  const elRef = useCallback(
    (node: any) => {
      if (node !== null) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              // Gọi hàm fetch data
              refetch();
            }
          },
          { threshold: 0 }
        );

        if (node) {
          observer.observe(node);
        }

        return () => {
          if (node) {
            observer.unobserve(node);
          }
        };
      }
    },
    [posts]
  );

  const deleteByPostId = async (id: any) => {
    const newpost = posts.filter((item: any) => item.data._id !== id);
    setPosts(newpost);
  };

  return (
    <div className="infinite-scroll-container w-full">
      <CreatePost add={createpost} />
      <div className="flex justify-between my-4">
        <Select onValueChange={setSelectedTopic}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Chọn chủ đề" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Loại bài viết</SelectLabel>
              <SelectItem value={"all"} key={0}>
                Tất cả
              </SelectItem>
              {allTopics?.map((item: any) => (
                <SelectItem value={item._id} key={item._id}>
                  {item.topicName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Filter />
      </div>
      <ul className="w-full flex flex-col gap-4 mt-4">
        {posts.map((post, index) => {
          if (index === posts.length - 1)
            return (
              <div key={post.data._id}>
                <li ref={elRef} className="w-full flex justify-center">
                  <Post data={post} deletepost={deleteByPostId} />
                </li>
                {isLoading ? (
                  <div className="w-full my-4 justify-center items-center flex gap-2 shadow-md bg-background py-2 rounded-md">
                    <Icons.spinner className="mr-2 h-5 w-5 animate-spin" /> Đang
                    tải bài viết mới
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          else
            return (
              <li key={post.data._id} className="w-full flex justify-center">
                <Post data={post} deletepost={deleteByPostId} />
              </li>
            );
        })}
      </ul>
    </div>
  );
};

export default Home;
