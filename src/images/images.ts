import * as _gm from "gm";
import * as fs from "node:fs";
import * as path from "node:path";
import {promisify} from "node:util";

import {fontsPath, imagePath, rootDir} from "../util";

export const gm = _gm.subClass({imageMagick : true});

// TODO possibly: make the macros a JSON for more modularity
export interface ImageMacro {
  name: string;
  filename: string;
  line_length: number;

  text_position: [ number, number ];

  text_size?: number;
  font?: string;
  text_color?: string;
  allcaps?: boolean;
}
export const MacroDefs: ImageMacro[] = [
  {
    filename : "clueless.png",
    line_length : " in the senat".length,
    text_position : [ 200, 40 ],
    text_size : 14,
    font : "FreeSerif.otf",
    name : "clueless",
  },
  {
    filename : "rdj.png",
    line_length : 40,
    text_position : [ 30, 150 ],
    text_size : 20,
    font : "FreeSans.otf",
    name : "rdj",
  },
  {
    filename : "farquaad.png",
    line_length : 55,
    text_position : [ 50, 950 ],
    text_size : 100,
    font : "impact.ttf",
    name : "farquaad",
    text_color : "#ffffff",
    allcaps : true,
  },
  {
    filename : "ahsweet.png",
    line_length : 15,
    text_position : [ 30, 130 ],
    text_size : 45,
    font : "impact.ttf",
    name : "ahsweet",
    text_color : "#000000",
    allcaps : true,
  },
  {
    filename : "scumbagsteve.jpg",
    line_length : 15,
    text_position : [ 20, 430 ],
    text_size : 45,
    font : "impact.ttf",
    name : "scumbagsteve",
    text_color : "#ffffff",
    allcaps : true,
  },
  {
    // It does somewhat bother me that our 400px goodguygreg image is not the
    // original, larger size (600px?). But not enough to go hunt down the
    // original
    filename : "goodguygreg.jpg",
    line_length : 15,
    text_position : [ 10, 300 ],
    text_size : 45,
    font : "impact.ttf",
    name : "goodguygreg",
    text_color : "#ffffff",
    allcaps : true,
  },
  {
    filename : "scalia.jpg",
    line_length : 15,
    text_position : [ 100, 1060 ],
    text_size : 120,
    font : "impact.ttf",
    name : "scalia",
    text_color : "#ffffff",
    allcaps : true,
  },
  {
    filename : "iamonceagainasking.png",
    line_length : 25,
    text_position : [ 80, 683 ],
    text_size : 50,
    font : "impact.ttf",
    name : "iamonceagainasking",
    text_color : "#ffffff",
    allcaps : true,
  },
  {
    filename : "goahead.png",
    line_length : 23,
    text_position : [ 5, 192 ],
    text_size : 24,
    font : "impact.ttf",
    name : "goahead",
    text_color : "#ffffff",
    allcaps : true,
  },
];

const wrapText = (text: string, line_chars: number) => {
  const re = /\s+/;
  const words = text.split(re);

  let line_count = 0;
  let output_str = "";

  for (const word of words) {
    line_count += word.length;

    if (line_count > line_chars) {
      output_str += "\n";
      line_count = word.length + 1;
    }

    output_str += word;
    output_str += " ";
  }

  return output_str;
};

export async function addImageText(macro: ImageMacro, text: string) {

  const generatedPath = path.join(rootDir, "generated");

  const output_path = path.join(generatedPath, `generated_${macro.filename}`);

  if (!fs.existsSync(generatedPath)) {
    fs.mkdirSync(generatedPath)
  }

  const image_base_path = path.join(imagePath, macro.filename);
  const font_path = path.join(fontsPath, macro.font ?? "FreeSansBold.otf");

  // imageMagick doesn't like to create and write to a file in the same step
  // hopefully this will placate it
  fs.copyFileSync(image_base_path, output_path)

  const [x, y] = macro.text_position;
  console.log(macro.filename);

  if (macro.allcaps ?? false) {
    text = text.toUpperCase();
  }

  const get_img = promisify((p: string, callback: (...args: any[]) => void) => {
    gm(image_base_path)
        .fill(macro.text_color ?? "#000000")
        .stroke("#000000")
        .font(font_path, macro.text_size ?? 14)
        .drawText(x, y, wrapText(text, macro.line_length))
        .write(p, callback);
  });

  await get_img(output_path);

  return output_path;
}
