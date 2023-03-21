import Jimp from "jimp";
import { Font, Print } from "@jimp/plugin-print";

export interface ImageMacro {
  readonly filepath: string;
  readonly font: string;
  readonly location: [number, number];
}

const Rdj: ImageMacro = {
  filepath: "rdj.png",
  font: Jimp.FONT_SANS_12_BLACK,
  location: [1, 1],
};

export function generateImage(macro: ImageMacro, message: string): void {}
