import Jimp from "jimp";
import { Font, Print } from "@jimp/plugin-print";

export interface ImageMacro {
  readonly filepath: string;
  readonly font: Font;
  readonly location: [number, number];
}

export function generateImage(macro: ImageMacro, message: string):void {



}
