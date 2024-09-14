import fs from "fs";
import path from "path";

export function isFile(maybe: string): boolean {
  try {
    const stats = fs.statSync(maybe);
    return stats.isFile();
  } catch (err) {
    // console.log(err);
    return false;
  }
}

export function readJson(filename: string): any {
  return JSON.parse(fs.readFileSync(filename, "utf-8"));
}

export function readBinary(filename: string): Buffer {
  return fs.readFileSync(filename, null);
}

export function readText(filename: string): any {
  return fs.readFileSync(filename, "utf-8");
}

/**
 * Writes SVG content to a file in a specified directory.
 * @param dir - The directory where the file should be created.
 * @param number - The number used to generate the file name.
 * @param svgContent - The SVG text content to write to the file.
 */
export function writeSVGTile(dir: string, number: number, svgContent: string): void {
  // Ensure the directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Generate the file name
  const fileName = `tile-${number}.svg`;
  const filePath = path.join(dir, fileName);

  // Write the SVG content to the file
  fs.writeFileSync(filePath, svgContent, "utf-8");
}

export function writeTextFile(filePath: string, svgContent: string): void {

  const dir = path.dirname(filePath)
  // Ensure the directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the SVG content to the file
  fs.writeFileSync(filePath, svgContent, "utf-8");
}