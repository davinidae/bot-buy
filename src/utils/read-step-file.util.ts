import fs from "fs";
import path from "path";
import { StepFile } from "../models";

export const readStepFile = (filePath: string): StepFile => {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Step file not found: ${fullPath}`);
  }
  const content = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(content);
};
