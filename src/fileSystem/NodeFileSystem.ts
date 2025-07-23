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
  read = (filePath: string) => this.fileReader(filePath, "utf-8");

  write = (filePath: string, JSONBlob: Object) =>
    this.fileWriter(filePath, JSON.stringify(JSONBlob, null, 2), "utf-8");

  makeDirectory = (filePath: string) => {
    const dir = path.dirname(filePath);

    this.directoryMaker(dir, { recursive: true });
  };

  checkExists = (filePath: string) => this.existsChecker(filePath);
}
