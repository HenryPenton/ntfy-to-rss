import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { Messages } from "../listeners/NTFYWebhookListener";

export interface IJSONMessageWriter {
  writeMessage: (message: Messages) => void;
}

export type FileReader = typeof readFileSync;
export type FileWriter = typeof writeFileSync;
export type DirectoryMaker = typeof mkdirSync;
export type ExistsChecker = typeof existsSync;
