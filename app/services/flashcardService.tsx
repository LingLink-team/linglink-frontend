import { AxiosResponse } from "axios";
import createAxiosInstance from "../utils/axiosInstance";

interface FlashcardProps {
  word: string;
  answer: any;
  listid: string;
}

export class FlashcardService {
  static async getByFlashcardListId(listId: string) {
    const queryParams: any = {
      id: listId,
    };
    const axiosInstance = createAxiosInstance();
    let result: any = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/flashcard-list/user`,
      {
        params: queryParams,
      }
    );
    return result.data.flashcardLists;
  }
  static async getByUser(page?: number, pageSize?: number) {
    const queryParams: any = {
      page: page,
      pageSize: pageSize,
    };
    const axiosInstance = createAxiosInstance();
    let result = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/flashcard-list/user`,
      {
        params: page && pageSize ? queryParams : {},
      }
    );
    return result;
  }
  static async create({ word, answer, listid }: FlashcardProps) {
    const axiosInstance = createAxiosInstance();
    await axiosInstance.post(`${process.env.NEXT_PUBLIC_BASE_URL}/flashcards`, {
      word: word,
      answer: answer,
      flashcardListId: listid,
    });
  }
  static async createFlashcardList({ name }: any) {
    const axiosInstance = createAxiosInstance();
    await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/flashcard-list`,
      {
        name: name,
      }
    );
  }
  static async changeStatus(
    course: any,
    status: any
  ): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/flashcards/changestate`,
      {
        id: course._id,
        state: status,
      }
    );
    return response;
  }
  static async removeFlashcardfromFlashcardList(
    flashcardListId: string,
    flashcardId: number
  ): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/flashcard-list/${flashcardListId}/${flashcardId}`
    );
    return response;
  }
}
