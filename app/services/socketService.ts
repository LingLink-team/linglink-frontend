import { AxiosResponse } from "axios";
import { io, Socket } from "socket.io-client";
import createAxiosInstance from "../utils/axiosInstance";

export async function connectSocket() {
  const axiosInstance = createAxiosInstance();
  const response: AxiosResponse<any> = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/chats/create-socket-token`
  );
  return io(`${process.env.NEXT_PUBLIC_API_URL}/chats`, {
    auth: {
      token: response.data,
    },
    transports: ["websocket", "polling"],
  });
}

export function disconnectSocket(socket: any) {
  socket?.disconnect();
}
