import { AxiosResponse } from "axios";
import createAxiosInstance from "../utils/axiosInstance";

export class CalendarService {
  static async create(body: any): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/calendar`,
      body
    );
    return response;
  }
  static async get(): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/calendar`
    );
    return response;
  }
  static async delete(id: string): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/calendar/${id}`
    );
    return response;
  }
  static async update(id: string, body: any): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/calendar/${id}`,
      body
    );
    return response;
  }
}
