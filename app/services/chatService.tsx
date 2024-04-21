import { AxiosResponse } from "axios";
import createAxiosInstance from "../utils/axiosInstance";

// interface FlashcardProps {
//     word: string;
//     answer: any;
//     listid: string;
// }

export class ChatService {
  static async getChatRoom() {
    const axiosInstance = createAxiosInstance();
    let result = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/chats`
    );
    return result.data;
  }

  static async searchFriendsByEmail(email: string) {
    const axiosInstance = createAxiosInstance();
    let result = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user`,
      {
        email: email,
      }
    );
    return result.data;
  }

  static async searchFriendsByName(name: string) {
    const axiosInstance = createAxiosInstance();
    const result = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/search?name=${name}`
    );
    return result.data;
  }

  static async getListRequest() {
    const axiosInstance = createAxiosInstance();
    let result = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/request-add-friend`
    );
    return result.data;
  }

  static async requestAddFriend(receiver: string) {
    const axiosInstance = createAxiosInstance();
    try {
      await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/request-add-friend`,
        {
          receiver: receiver,
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  static async denyFriend(request: string) {
    const axiosInstance = createAxiosInstance();
    try {
      await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/request-add-friend/deny`,
        {
          request: request,
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  static async acceptFriend(request: string) {
    const axiosInstance = createAxiosInstance();
    try {
      await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/request-add-friend/accept`,
        {
          request: request,
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
  // static async create({ word, answer, listid }: FlashcardProps) {
  //     const axiosInstance = createAxiosInstance();
  //     await axiosInstance.post(`${process.env.NEXT_PUBLIC_BASE_URL}/flashcards`, {
  //     word: word,
  //     answer: answer,
  //     flashcardListId: listid,
  //     });
  // }
}
