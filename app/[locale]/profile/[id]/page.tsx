"use client";
import { useAppSelector } from "@/app/redux/store";
import { ChatService, TopicService, UserService } from "@/app/services";
import createAxiosInstance from "@/app/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import CreatePost from "../../(homepage)/components/createpost";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Post } from "@/components/posts/post";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { IoMdPersonAdd } from "react-icons/io";
import Goal from "../../(homepage)/components/goals";

const Profile = ({ params }: { params: any }) => {
  const current_user = useAppSelector((state) => state.auth.userinfor);
  const { data: user } = useQuery({
    queryKey: ["profile", params.id],
    queryFn: async () => {
      const res = await UserService.getUserById(params.id);
      return res.data;
    },
  });
  const { data: friends } = useQuery({
    queryKey: ["friend", params.id],
    queryFn: async () => {
      const friends = await ChatService.getChatRoom();
      console.log("friends", friends);
      return friends;
    },
  });

  // Xử lý post

  const [posts, setPosts] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("all");

  const createpost = (post: any) => {
    setPosts((prev: any) => [post, ...prev]);
  };
  const axiosJWT = createAxiosInstance();

  const { refetch, isLoading } = useQuery({
    queryKey: ["posts", selectedTopic],
    queryFn: async () => {
      let lastId = "";
      if (posts && posts.length > 0) lastId = posts[posts.length - 1].data._id;
      const newData = await axiosJWT.get(
        `${process.env.NEXT_PUBLIC_BASE_URL_V2}/posts/page`,
        {
          params: {
            author: params.id,
            lastPostId: lastId,
            pageSize: 5,
            ...(selectedTopic !== "all" && { topic: selectedTopic }),
          },
        }
      );
      if (posts.length > 20 && newData.data.length > 0) {
        setPosts(() => {
          const updatedPosts = [...newData.data];
          return updatedPosts;
        });
      } else
        setPosts((prevData: any) => {
          const updatedPosts = [...prevData, ...newData.data];
          return updatedPosts;
        });
      return newData.data;
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
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        setPosts([]);
      }

      await Promise.all([setPostsPromise]);
      refetch();
    };

    const setPostsPromise = new Promise((resolve) => {
      setPosts([]);
      resolve({});
    });

    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [selectedTopic]);

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
    <div className="">
      <div className="w-full bg-white rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between container">
          <div className="flex gap-8 items-center">
            <Image
              className="w-32 h-32 rounded-full object-contain"
              width={0}
              height={0}
              src={user?.avatar}
              alt="avatar"
            />
            <div>
              <div className="font-bold text-2xl">{user?.name}</div>
              <div className="text-slate-600 text-sm mt-2">
                {friends && friends.length} bạn bè
              </div>
              <div className="flex space-x-[-10px] mt-2">
                {friends &&
                  friends
                    .slice(0, 7)
                    .map((friend: any) => (
                      <Image
                        key={friend.id}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white bg-black"
                        height={0}
                        width={0}
                        src={friend.friends?.avatar}
                        alt="avatar"
                      />
                    ))}
              </div>
            </div>
          </div>
          <div>
            <Button className="flex items-center gap-1">
              <IoMdPersonAdd />
              Thêm bạn bè
            </Button>
          </div>
        </div>
      </div>
      <div className="flex gap-8 container mt-4">
        <div className="basis-2/5">
          <Goal />
        </div>
        <div className="basis-3/5">
          <div className="infinite-scroll-container w-full">
            {current_user._id === params.id && <CreatePost add={createpost} />}
            <div className="flex justify-between my-1">
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
            </div>
            <ul className="w-full flex flex-col gap-4 mt-4">
              {posts.map((post, index) => {
                if (index === posts.length - 1)
                  return (
                    <div key={index}>
                      <li ref={elRef} className="w-full flex justify-center">
                        <Post data={post} deletepost={deleteByPostId} />
                      </li>
                      {isLoading ? (
                        <div className="w-full my-4 justify-center items-center flex gap-2 shadow-md bg-background py-2 rounded-md">
                          <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />{" "}
                          Đang tải bài viết mới
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                else
                  return (
                    <li key={index} className="w-full flex justify-center">
                      <Post data={post} deletepost={deleteByPostId} />
                    </li>
                  );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
