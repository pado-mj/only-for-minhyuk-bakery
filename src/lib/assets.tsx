import type { ComponentType, SVGProps } from "react";
import {
  Blueberry,
  Cherry,
  Cucumber,
  MintChoco,
  RoseSingle,
  RoseStem,
  Strawberry,
} from "@/components/icons/decorations";
import type { DecorationCategory } from "@/types/cake";

export interface DecorationAsset {
  id: string;
  category: DecorationCategory;
  labelKo: string;
  labelEn: string;
  labelJa: string;
  // Either a hand-coded SVG icon, or a path to an illustrated PNG asset
  // (see public/assets) — CanvasObjectSprite renders whichever is set.
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
  imageSrc?: string;
}

const DECO_IMG = "/assets/decorations";

export const DECORATION_ASSETS: DecorationAsset[] = [
  // Illustrated (Midjourney-sourced, background-removed) assets
  { id: "dog-plain", category: "dog", labelKo: "강아지", labelEn: "Dog", labelJa: "わんこ", imageSrc: `${DECO_IMG}/dog-plain.png` },
  { id: "dog-cool", category: "dog", labelKo: "쿨한 강아지", labelEn: "Cool Dog", labelJa: "クールなわんこ", imageSrc: `${DECO_IMG}/dog-cool.png` },
  { id: "dog-party", category: "dog", labelKo: "파티 강아지", labelEn: "Party Dog", labelJa: "パーティわんこ", imageSrc: `${DECO_IMG}/dog-party.png` },
  { id: "dog-love", category: "dog", labelKo: "사랑둥이 강아지", labelEn: "Loving Dog", labelJa: "ラブわんこ", imageSrc: `${DECO_IMG}/dog-love.png` },
  { id: "whale", category: "whale", labelKo: "고래", labelEn: "Whale", labelJa: "クジラ", imageSrc: `${DECO_IMG}/whale.png` },
  { id: "tiger", category: "animal", labelKo: "호랑이", labelEn: "Tiger", labelJa: "とら", imageSrc: `${DECO_IMG}/tiger.png` },
  { id: "dumpling", category: "animal", labelKo: "만두", labelEn: "Dumpling", labelJa: "ぎょうざ", imageSrc: `${DECO_IMG}/dumpling.png` },
  { id: "frog", category: "animal", labelKo: "개구리", labelEn: "Frog", labelJa: "かえる", imageSrc: `${DECO_IMG}/frog.png` },
  { id: "turtle", category: "animal", labelKo: "거북이", labelEn: "Turtle", labelJa: "かめ", imageSrc: `${DECO_IMG}/turtle.png` },
  { id: "bee", category: "animal", labelKo: "꿀벌", labelEn: "Bee", labelJa: "みつばち", imageSrc: `${DECO_IMG}/bee.png` },
  { id: "cat", category: "animal", labelKo: "고양이", labelEn: "Cat", labelJa: "ねこ", imageSrc: `${DECO_IMG}/cat.png` },
  { id: "bear", category: "animal", labelKo: "곰돌이", labelEn: "Bear", labelJa: "くま", imageSrc: `${DECO_IMG}/bear.png` },
  { id: "hamster", category: "animal", labelKo: "햄스터", labelEn: "Hamster", labelJa: "ハムスター", imageSrc: `${DECO_IMG}/hamster.png` },
  { id: "heart", category: "decor", labelKo: "하트", labelEn: "Heart", labelJa: "ハート", imageSrc: `${DECO_IMG}/heart.png` },
  { id: "clover", category: "decor", labelKo: "네잎클로버", labelEn: "Clover", labelJa: "クローバー", imageSrc: `${DECO_IMG}/clover.png` },
  { id: "sparkle-star", category: "decor", labelKo: "별빛", labelEn: "Sparkle", labelJa: "きらきら", imageSrc: `${DECO_IMG}/sparkle-star.png` },
  { id: "firework", category: "decor", labelKo: "폭죽", labelEn: "Firework", labelJa: "花火", imageSrc: `${DECO_IMG}/firework.png` },
  { id: "palette", category: "decor", labelKo: "팔레트", labelEn: "Palette", labelJa: "パレット", imageSrc: `${DECO_IMG}/palette.png` },
  { id: "brush", category: "decor", labelKo: "붓", labelEn: "Paintbrush", labelJa: "筆", imageSrc: `${DECO_IMG}/brush.png` },
  { id: "ribbon-blue", category: "ribbon", labelKo: "블루 리본", labelEn: "Blue Ribbon", labelJa: "ブルーリボン", imageSrc: `${DECO_IMG}/ribbon-blue.png` },
  { id: "ribbon-pink", category: "ribbon", labelKo: "핑크 리본", labelEn: "Pink Ribbon", labelJa: "ピンクリボン", imageSrc: `${DECO_IMG}/ribbon-pink.png` },

  // Hand-coded SVG assets (no illustrated version yet)
  { id: "fruit-strawberry", category: "fruit", labelKo: "딸기", labelEn: "Strawberry", labelJa: "いちご", Icon: Strawberry },
  { id: "fruit-cherry", category: "fruit", labelKo: "체리", labelEn: "Cherry", labelJa: "さくらんぼ", Icon: Cherry },
  { id: "fruit-blueberry", category: "fruit", labelKo: "블루베리", labelEn: "Blueberry", labelJa: "ブルーベリー", Icon: Blueberry },
  { id: "rose-single", category: "rose", labelKo: "장미", labelEn: "Rose", labelJa: "バラ", Icon: RoseSingle },
  { id: "rose-stem", category: "rose", labelKo: "장미 줄기", labelEn: "Rose Stem", labelJa: "バラの茎", Icon: RoseStem },
  { id: "hate-cucumber", category: "hate", labelKo: "오이", labelEn: "Cucumber", labelJa: "きゅうり", Icon: Cucumber },
  { id: "hate-mint-choco", category: "hate", labelKo: "민트초코", labelEn: "Mint Chocolate", labelJa: "ミントチョコ", Icon: MintChoco },
];

export function getDecorationAsset(id: string) {
  return DECORATION_ASSETS.find((a) => a.id === id);
}

export interface CakeDesignAsset {
  id: string;
  labelKo: string;
  labelEn: string;
  labelJa: string;
  imageSrc: string;
}

export const CAKE_DESIGNS: CakeDesignAsset[] = [
  { id: "classic", labelKo: "클래식", labelEn: "Classic", labelJa: "クラシック", imageSrc: "/assets/cake/cake-base.png" },
  { id: "round", labelKo: "홀케이크", labelEn: "Round Cake", labelJa: "ホールケーキ", imageSrc: "/assets/cake/cake-round.png" },
  { id: "ruffle", labelKo: "러플 케이크", labelEn: "Ruffle Cake", labelJa: "ラッフルケーキ", imageSrc: "/assets/cake/cake-ruffle.png" },
  { id: "two-tier", labelKo: "2단 케이크", labelEn: "Two-tier Cake", labelJa: "2段ケーキ", imageSrc: "/assets/cake/cake-two-tier.png" },
  { id: "cut", labelKo: "잘린 홀케이크", labelEn: "Cut Cake", labelJa: "カットケーキ", imageSrc: "/assets/cake/cake-cut.png" },
];

export function getCakeDesign(id?: string) {
  return CAKE_DESIGNS.find((cake) => cake.id === id) ?? CAKE_DESIGNS[0];
}

export const BACKGROUND_COLOR_PRESETS = [
  { id: "peach", hex: "#F6DCC6" },
  { id: "blush", hex: "#F3CBD3" },
  { id: "mint", hex: "#CFE3D4" },
  { id: "sky", hex: "#CFE0EE" },
  { id: "lilac", hex: "#DCD3EA" },
  { id: "butter", hex: "#F2E4B8" },
];

export const PRESET_TOPPERS = [
  "HAPPY BIRTHDAY",
  "MINHYUK",
  "1103",
  "ONLY FOR MINHYUK",
  "LOVE YOU",
  "♡",
];
