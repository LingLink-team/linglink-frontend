import { AxiosResponse } from "axios";
import createAxiosInstance from "../utils/axiosInstance";

export class ReactionService {
  static async reactionPost(
    type: any,
    postid: any
  ): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/reactions/${type}`,
      {
        postId: postid,
      }
    );
    return response;
  }
  static async reactionComment(
    type: any,
    commentid: any
  ): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/reactions/${type}comment`,
      {
        commentId: commentid,
      }
    );
    return response;
  }
  static async getReactionPost(postid: any): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/reactions/post/${postid}`
    );
    return response;
  }
  static async getReactionComment(commentid: any): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/reactions/comment/${commentid}`
    );
    return response;
  }
}
