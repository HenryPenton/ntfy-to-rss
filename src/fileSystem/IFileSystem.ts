import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

export type FileReader = typeof readFileSync;
export type FileWriter = typeof writeFileSync;
export type DirectoryMaker = typeof mkdirSync;
export type ExistsChecker = typeof existsSync;

export interface IFileSystem {
  readJSONFile: (filePath: string) => Object;
  writeJSONFile: (filePath: string, JSONMessage: Object) => void;
  makeDirectoryForFile: (dir: string) => void;
  checkFileExists: (filePath: string) => boolean;
}
