import { customAlphabet } from "nanoid";

const alphabet = "23456789abcdefghjkmnpqrstuvwxyz";
export const generatePublicId = customAlphabet(alphabet, 10);
