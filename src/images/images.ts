import { rootDir, dataPath } from "../util";

const path = require("node:path");
const fs = require("node:fs");

const gm = require("gm").subClass({ imageMagick: "7+" });

const imagePath = path.join(dataPath, "image-templates");
const fontsPath = path.join(dataPath, "fonts");

// TODO possibly: make the macros a JSON for more modularity
export interface ImageMacro {
  filename: string;
  line_length: number;

  text_position: [number, number];
  command_prefix: string;

  text_size?: number;
  font?: string;
  text_color?: string;
}

const Clueless: ImageMacro = {
  filename: "clueless.png",
  line_length: " in the senat".length,
  text_position: [200, 40],
  text_size: 14,
  font: "FreeSerif.otf",
  command_prefix: "clueless",
};

const Rdj: ImageMacro = {
  filename: "rdj.png",
  line_length: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa".length,
  text_position: [30, 150],
  text_size: 20,
  font: "FreeSans.otf",
  command_prefix: "rdj",
};

export const MacroDefs = { clueless: Clueless, rdj: Rdj };

const wrapText = (text: string, line_chars: number) => {
  const re = /\s+/;
  const words = text.split(re);

  let line_count = 0;
  let output_str = "";

  for (let word of words) {
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

async function addImageText(macro: ImageMacro, text: string) {
  const generatedPath = path.join(rootDir, "generated");

  if (!fs.existsSync(generatedPath)) {
    fs.mkdirSync(generatedPath);
  }

  const output_path = path.join(generatedPath, `generated_${macro.filename}`);

  gm(output_path).createDirectories();

  const image_base_path = path.join(imagePath, macro.filename);
  const font_path = path.join(
    fontsPath,
    macro.font ?? "FreeSansBold.otf"
  );

  const [x, y] = macro.text_position;
  console.log(macro.filename);
  gm(image_base_path)
    .stroke(macro.text_color ?? "#000000")
    .font(font_path, macro.text_size ?? 14)
    .drawText(x, y, wrapText(text, macro.line_length))
    .write(output_path, (err: any) => {
      console.log(err ? err : "OK");
    });

  return output_path;
}

function main() {
  addImageText(MacroDefs.rdj, "I have ported macros");
}

main();
