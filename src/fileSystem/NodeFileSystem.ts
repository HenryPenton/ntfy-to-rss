import path from "path";
import {
  DirectoryMaker,
  ExistsChecker,
  FileReader,
  FileWriter,
  IFileSystem,
} from "./IFileSystem";

export class NodeFileSystem implements IFileSystem {
  constructor(
    private readonly fileReader: FileReader,
    private readonly fileWriter: FileWriter,
    private readonly directoryMaker: DirectoryMaker,
    private readonly existsChecker: ExistsChecker
  ) {}

  readJSONFile = (filePath: string) => {
    return JSON.parse(this.fileReader(filePath, "utf-8"));
  };

  writeJSONFile = (filePath: string, JSONBlob: Object) => {
    this.fileWriter(filePath, JSON.stringify(JSONBlob), "utf-8");
  };

  makeDirectoryForFile = (filePath: string) => {
    const dir = path.dirname(filePath);

    this.directoryMaker(dir, { recursive: true });
  };

  checkFileExists = (filePath: string) => {
    return this.checkExists(filePath);
  };

  private checkExists(filePath: string) {
    return this.existsChecker(filePath);
  }
}
