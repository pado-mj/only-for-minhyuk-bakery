import { create } from "zustand";
import type { CakeRecord } from "@/types/cake";

interface LastCreatedState {
  record: CakeRecord | null;
  setRecord: (record: CakeRecord) => void;
}

// Holds the cake just submitted so the complete screen can render it
// instantly without waiting on a round-trip read-after-write to Supabase.
export const useLastCreatedStore = create<LastCreatedState>((set) => ({
  record: null,
  setRecord: (record) => set({ record }),
}));
