import { create } from "zustand";
import { nanoid } from "nanoid";
import type { CakeData, CanvasObject, ObjectLayer } from "@/types/cake";
import { CAKE_COLOR_PRESETS, BACKGROUND_COLOR_PRESETS } from "@/lib/assets";

const HISTORY_LIMIT = 40;

function emptyCakeData(): CakeData {
  return {
    background: { mode: "preset", color: BACKGROUND_COLOR_PRESETS[0].hex },
    cakeColor: CAKE_COLOR_PRESETS[0].hex,
    objects: [],
  };
}

function clone(data: CakeData): CakeData {
  return {
    background: { ...data.background },
    cakeColor: data.cakeColor,
    objects: data.objects.map((o) => ({ ...o })),
  };
}

interface EditorState {
  present: CakeData;
  past: CakeData[];
  future: CakeData[];
  selectedId: string | null;
  submitted: boolean;
  markSubmitted: () => void;

  setBackgroundColor: (hex: string, mode: "preset" | "custom") => void;
  setCakeColor: (hex: string) => void;
  addObject: (partial: Omit<CanvasObject, "id" | "zIndex">) => string;
  updateObjectTransform: (
    id: string,
    patch: Partial<Pick<CanvasObject, "x" | "y" | "scale" | "rotation">>
  ) => void;
  commit: () => void;
  removeObject: (id: string) => void;
  duplicateObject: (id: string) => void;
  reorderLayer: (id: string, direction: "forward" | "backward") => void;
  selectObject: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  resetCake: () => void;
  removeObjectsOfType: (type: CanvasObject["type"]) => void;
  addCandle: (assetId: string, layer?: ObjectLayer) => string;
  loadCakeData: (data: CakeData) => void;
}

function nextZIndex(objects: CanvasObject[]) {
  return objects.reduce((max, o) => Math.max(max, o.zIndex), 0) + 1;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  present: emptyCakeData(),
  past: [],
  future: [],
  selectedId: null,
  submitted: false,
  markSubmitted: () => set({ submitted: true }),

  setBackgroundColor: (hex, mode) => {
    const { present, past } = get();
    set({
      past: [...past, clone(present)].slice(-HISTORY_LIMIT),
      future: [],
      present: { ...present, background: { mode, color: hex } },
    });
  },

  setCakeColor: (hex) => {
    const { present, past } = get();
    set({
      past: [...past, clone(present)].slice(-HISTORY_LIMIT),
      future: [],
      present: { ...present, cakeColor: hex },
    });
  },

  addObject: (partial) => {
    const { present, past } = get();
    const id = nanoid(8);
    const object: CanvasObject = { ...partial, id, zIndex: nextZIndex(present.objects) };
    set({
      past: [...past, clone(present)].slice(-HISTORY_LIMIT),
      future: [],
      present: { ...present, objects: [...present.objects, object] },
      selectedId: id,
    });
    return id;
  },

  updateObjectTransform: (id, patch) => {
    const { present } = get();
    set({
      present: {
        ...present,
        objects: present.objects.map((o) => (o.id === id ? { ...o, ...patch } : o)),
      },
    });
  },

  commit: () => {
    const { present, past } = get();
    const last = past[past.length - 1];
    if (last && JSON.stringify(last) === JSON.stringify(present)) return;
    set({ past: [...past, clone(last ?? present)].slice(-HISTORY_LIMIT), future: [] });
  },

  removeObject: (id) => {
    const { present, past } = get();
    set({
      past: [...past, clone(present)].slice(-HISTORY_LIMIT),
      future: [],
      present: { ...present, objects: present.objects.filter((o) => o.id !== id) },
      selectedId: get().selectedId === id ? null : get().selectedId,
    });
  },

  duplicateObject: (id) => {
    const { present, past } = get();
    const source = present.objects.find((o) => o.id === id);
    if (!source) return;
    const copy: CanvasObject = {
      ...source,
      id: nanoid(8),
      x: Math.min(1080, source.x + 40),
      y: Math.min(1080, source.y + 40),
      zIndex: nextZIndex(present.objects),
    };
    set({
      past: [...past, clone(present)].slice(-HISTORY_LIMIT),
      future: [],
      present: { ...present, objects: [...present.objects, copy] },
      selectedId: copy.id,
    });
  },

  reorderLayer: (id, direction) => {
    const { present, past } = get();
    const objects = [...present.objects].sort((a, b) => a.zIndex - b.zIndex);
    const idx = objects.findIndex((o) => o.id === id);
    if (idx === -1) return;
    const swapWith = direction === "forward" ? idx + 1 : idx - 1;
    if (swapWith < 0 || swapWith >= objects.length) return;
    if (objects[swapWith].layer !== objects[idx].layer) return;
    const tmp = objects[idx].zIndex;
    objects[idx].zIndex = objects[swapWith].zIndex;
    objects[swapWith].zIndex = tmp;
    set({
      past: [...past, clone(present)].slice(-HISTORY_LIMIT),
      future: [],
      present: { ...present, objects },
    });
  },

  selectObject: (id) => set({ selectedId: id }),

  undo: () => {
    const { past, present, future } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    set({
      past: past.slice(0, -1),
      present: previous,
      future: [clone(present), ...future].slice(0, HISTORY_LIMIT),
      selectedId: null,
    });
  },

  redo: () => {
    const { past, present, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      past: [...past, clone(present)].slice(-HISTORY_LIMIT),
      present: next,
      future: future.slice(1),
      selectedId: null,
    });
  },

  resetCake: () => {
    set({ present: emptyCakeData(), past: [], future: [], selectedId: null, submitted: false });
  },

  removeObjectsOfType: (type) => {
    const { present, past } = get();
    set({
      past: [...past, clone(present)].slice(-HISTORY_LIMIT),
      future: [],
      present: { ...present, objects: present.objects.filter((o) => o.type !== type) },
    });
  },

  addCandle: (assetId, layer = 5) => {
    const { present, past } = get();
    const id = nanoid(8);
    const existingCandles = present.objects.filter((o) => o.type === "candle");
    const x = 1080 * (0.28 + (existingCandles.length % 8) * 0.08);
    const y = 1080 * 0.4;
    const object: CanvasObject = {
      id,
      type: "candle",
      assetId,
      x,
      y,
      scale: 1,
      rotation: 0,
      zIndex: nextZIndex(present.objects),
      layer,
    };
    set({
      past: [...past, clone(present)].slice(-HISTORY_LIMIT),
      future: [],
      present: { ...present, objects: [...present.objects, object] },
    });
    return id;
  },

  loadCakeData: (data) => set({ present: clone(data), past: [], future: [], selectedId: null }),
}));
