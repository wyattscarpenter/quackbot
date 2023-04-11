import { rootDir, imagePath } from "../util";
import { gm } from "./images";

import * as path from "node:path";

import { promisify } from "node:util";

const YUD_HEIGHT_MAX = 2;
const YUD_HEIGHT_MIN = 0.01;
const YUD_WIDTH_MAX = 2;
const YUD_WIDTH_MIN = 0.01;

const rand_range = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

interface Size {
  width: number;
  height: number;
}

export async function getYud() {
  const yud_h = rand_range(YUD_HEIGHT_MIN, YUD_HEIGHT_MAX);
  const yud_w = rand_range(YUD_WIDTH_MIN, YUD_WIDTH_MAX);

  const yud_path = path.join(imagePath, "yud.png");
  const output_path = path.join(rootDir, "generated", "generated_yud.png");

  console.error(yud_path)

  gm(yud_path)
.size(function (err, size) {
  if (!err)
    console.error(size.width > size.height ? 'wider' : 'taller than you');
});

  const yud_img = gm(yud_path);
  const _size = promisify(yud_img.size);
  console.error("aa");
  const size = (await _size()) as Size;


  console.error(size.width);

  const _yud = (callback: (...args: any[]) => void) => {
    gm(yud_path)
      .resize(yud_w * size.width, yud_h * size.height)
      .write(output_path, callback);
  };

  await promisify(_yud)();
  return output_path;
}

function main() {
  getYud();
}

main();
