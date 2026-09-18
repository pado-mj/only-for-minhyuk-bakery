export type ObjectLayer = 2 | 3 | 4 | 5;

export type DecorationCategory =
  | "fruit"
  | "ribbon"
  | "dog"
  | "whale"
  | "rose"
  | "hate"
  | "animal"
  | "decor";

export type ObjectType = "image" | "decoration" | "topper" | "candle";

export interface CanvasObject {
  id: string;
  type: ObjectType;
  assetId: string;
  category?: DecorationCategory;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
  layer: ObjectLayer;
  text?: string;
  textStyle?: "light" | "dark";
  imageDataUrl?: string;
}

export interface CakeBackground {
  mode: "preset" | "custom";
  color: string;
}

export interface CakeData {
  background: CakeBackground;
  cakeColor: string;
  objects: CanvasObject[];
}

export type CakeStatus = "published" | "hidden" | "removed";

export interface CakeRecord {
  id: string;
  publicId: string;
  publicNumber: number;
  nickname: string;
  country?: string;
  letter: string;
  cakeData: CakeData;
  finalImageUrl?: string;
  viewCount: number;
  createdAt: string;
  status: CakeStatus;
}

export const CANVAS_SIZE = 1080;

export const CANDLE_LIMITS = {
  classic: { min: 1, max: 33 },
  heart: { min: 0, max: 3 },
  dog: { min: 0, max: 3 },
  number: { min: 0, max: 16 },
} as const;

export type CandleKind = keyof typeof CANDLE_LIMITS;
