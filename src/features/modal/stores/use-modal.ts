import { ReactNode } from "react";
import { create } from "zustand";

interface IModalStore {
  content: ReactNode | null;
  showing: boolean;
  setShowing: (showing: boolean) => void;
  show: (content: ReactNode) => void;
  hide: () => void;
}

export const useModalStore = create<IModalStore>((set, get) => ({
  content: null,
  showing: false,
  setShowing: (showing: boolean) => set({ showing }),
  show: (content: ReactNode) => set({ content, showing: true }),
  hide: () => set({ showing: false, content: null })
}));
