import { AxiosResponse } from "axios";
import createAxiosInstance from "../utils/axiosInstance";

export class NotificationService {
  static async create(body: any): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/notifications`,
      body
    );
    return response;
  }
  static async get(lastNoti: string): Promise<AxiosResponse<any>> {
    const queryParams: any = {
      lastNoti: lastNoti !== "" ? lastNoti : undefined,
    };
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/notifications`,
      {
        params: queryParams,
      }
    );
    return response;
  }

  static async view(ids: string[]): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/view`,
      {
        ids: ids,
      }
    );
    return response;
  }
}
