import { create } from "zustand";

interface SubmissionState {
  nickname: string;
  country: string | undefined;
  letter: string;
  hideLetterOnTable: boolean;
  setNickname: (v: string) => void;
  setCountry: (v: string | undefined) => void;
  setLetter: (v: string) => void;
  setHideLetterOnTable: (v: boolean) => void;
  reset: () => void;
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  nickname: "",
  country: undefined,
  letter: "",
  hideLetterOnTable: false,
  setNickname: (v) => set({ nickname: v }),
  setCountry: (v) => set({ country: v }),
  setLetter: (v) => set({ letter: v }),
  setHideLetterOnTable: (v) => set({ hideLetterOnTable: v }),
  reset: () => set({ nickname: "", country: undefined, letter: "", hideLetterOnTable: false }),
}));
