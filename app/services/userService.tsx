import { AxiosResponse } from "axios";
import createAxiosInstance from "../utils/axiosInstance";

export class UserService {
  static async changePassword({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/changepassword`,
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
      }
    );
    return response;
  }
  static async getUserById(id: string): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/${id}`
    );
    return response;
  }

  static async setTarget(
    description: string,
    startDate: Date,
    targetDate: Date
  ) {
    const axiosInstance = createAxiosInstance();
    const target = {
      description: description,
      startDate: startDate,
      targetDate: targetDate,
    };
    const response: AxiosResponse<any> = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/target`,
      target
    );
    return response;
  }

  static async getFriends(user: string) {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/friends/${user}`
    );
    return response;
  }
}
