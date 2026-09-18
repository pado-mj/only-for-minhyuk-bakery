import { create } from "zustand";

interface SubmissionState {
  nickname: string;
  country: string | undefined;
  letter: string;
  setNickname: (v: string) => void;
  setCountry: (v: string | undefined) => void;
  setLetter: (v: string) => void;
  reset: () => void;
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  nickname: "",
  country: undefined,
  letter: "",
  setNickname: (v) => set({ nickname: v }),
  setCountry: (v) => set({ country: v }),
  setLetter: (v) => set({ letter: v }),
  reset: () => set({ nickname: "", country: undefined, letter: "" }),
}));
