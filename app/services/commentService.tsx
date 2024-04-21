import { AxiosResponse } from "axios";
import createAxiosInstance from "../utils/axiosInstance";

export class CommentService {
  static async createComment(comment: any): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/comments`,
      comment
    );
    return response;
  }
  static async getComments(postid: any): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/comments/post`,
      {
        params: {
          postId: postid,
        },
      }
    );
    return response;
  }
  static async getCommentsByCommentId(id: any): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/comments/`,
      {
        params: {
          commentId: id,
        },
      }
    );
    return response;
  }
  static async deleteCommentsByPostId(id: any): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/comments/post/${id}`
    );
    return response;
  }
  static async deleteById(id: any): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/comments/${id}`
    );
    return response;
  }
}
