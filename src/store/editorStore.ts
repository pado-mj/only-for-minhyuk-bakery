import { create } from "zustand";
import { nanoid } from "nanoid";
import type { CakeData, CanvasObject, ObjectLayer } from "@/types/cake";
import { BACKGROUND_COLOR_PRESETS, CAKE_DESIGNS } from "@/lib/assets";

const HISTORY_LIMIT = 40;

function emptyCakeData(): CakeData {
  return {
    background: { mode: "preset", color: BACKGROUND_COLOR_PRESETS[0].hex, texture: "paper" },
    cakeDesign: CAKE_DESIGNS[0].id,
    objects: [],
  };
}

function clone(data: CakeData): CakeData {
  return {
    background: { ...data.background },
    cakeColor: data.cakeColor,
    cakeDesign: data.cakeDesign ?? "classic",
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
  setBackgroundTexture: (texture: "paper" | "check" | "kraft") => void;
  setCakeDesign: (id: string) => void;
  addObject: (partial: Omit<CanvasObject, "id" | "zIndex">) => string;
  updateObjectTransform: (
    id: string,
    patch: Partial<Pick<CanvasObject, "x" | "y" | "scale" | "rotation">>
  ) => void;
  commit: () => void;
  removeObject: (id: string) => void;
  duplicateObject: (id: string) => void;
  flipObject: (id: string) => void;
  reorderLayer: (id: string, direction: "forward" | "backward" | "front" | "back") => void;
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
      present: { ...present, background: { ...present.background, mode, color: hex } },
    });
  },

  setBackgroundTexture: (texture) => {
    const { present, past } = get();
    set({
      past: [...past, clone(present)].slice(-HISTORY_LIMIT),
      future: [],
      present: { ...present, background: { ...present.background, texture } },
    });
  },

  setCakeDesign: (id) => {
    const { present, past } = get();
    set({
      past: [...past, clone(present)].slice(-HISTORY_LIMIT),
      future: [],
      present: { ...present, cakeDesign: id },
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

  flipObject: (id) => {
    const { present, past } = get();
    const source = present.objects.find((o) => o.id === id);
    if (!source) return;
    set({
      past: [...past, clone(present)].slice(-HISTORY_LIMIT),
      future: [],
      present: {
        ...present,
        objects: present.objects.map((o) => o.id === id ? { ...o, flipX: !o.flipX } : o),
      },
    });
  },

  reorderLayer: (id, direction) => {
    const { present, past } = get();
    const selected = present.objects.find((o) => o.id === id);
    if (!selected) return;
    // The cake base is not a canvas object. Preserve layer boundaries,
    // and only reorder objects within the selected object's layer.
    const peers = present.objects
      .filter((o) => o.layer === selected.layer)
      .sort((a, b) => a.zIndex - b.zIndex);
    const index = peers.findIndex((o) => o.id === id);
    const destination = direction === "front" ? peers.length - 1
      : direction === "back" ? 0
      : direction === "forward" ? index + 1 : index - 1;
    if (index === -1 || destination < 0 || destination >= peers.length || index === destination) return;
    const reordered = [...peers];
    const [moving] = reordered.splice(index, 1);
    reordered.splice(destination, 0, moving);
    const zValues = peers.map((o) => o.zIndex);
    const nextZ = new Map(reordered.map((o, i) => [o.id, zValues[i]]));
    set({
      past: [...past, clone(present)].slice(-HISTORY_LIMIT),
      future: [],
      present: {
        ...present,
        objects: present.objects.map((o) => nextZ.has(o.id) ? { ...o, zIndex: nextZ.get(o.id)! } : o),
      },
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
