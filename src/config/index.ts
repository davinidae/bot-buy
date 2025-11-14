import * as dotenv from "dotenv";
import { BotConfig } from "../models";

dotenv.config();

export const botConfig: BotConfig = {
  headless: process.env.HEADLESS === "true" || false,
  timeout: parseInt(process.env.TIMEOUT || "30000", 10),
  viewport: {
    width: parseInt(process.env.VIEWPORT_WIDTH || "1920", 10),
    height: parseInt(process.env.VIEWPORT_HEIGHT || "1080", 10),
  },
};

export const credentials = {
  email: process.env.EMAIL || "",
  password: process.env.PASSWORD || "",
  phone: process.env.PHONE_NUMBER || "",
};
