import { AxiosResponse } from "axios";
import createAxiosInstance from "../utils/axiosInstance";

export class TopicService {
  static async getAll(): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/topics`
    );
    return response;
  }
}
