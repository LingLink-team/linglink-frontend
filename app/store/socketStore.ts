import { create } from "zustand";

type Socket = {
  socket: any;
  setSocket: (data: any) => void;
};

export const useSocketStore = create<Socket>()((set) => ({
  socket: null,
  setSocket: (data: any) => set(() => ({ socket: data })),
}));
