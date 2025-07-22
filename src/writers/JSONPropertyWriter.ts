import path from "path";
import { Messages } from "../listeners/NTFYWebhookListener";
import {
  DirectoryMaker,
  ExistsChecker,
  FileReader,
  FileWriter,
  IJSONMessageWriter,
} from "./IJSONPropertyWriter";

export class JSONMessageWriter implements IJSONMessageWriter {
  constructor(
    private readonly filePath: string,
    private readonly fileReader: FileReader,
    private readonly fileWriter: FileWriter,
    private readonly directoryMaker: DirectoryMaker,
    private readonly existsChecker: ExistsChecker
  ) {
    this.ensureFileExists();
  }

  private ensureFileExists = () => {
    if (!this.existsChecker(this.filePath)) {
      const dir = path.dirname(this.filePath);
      this.directoryMaker(dir, { recursive: true });
      this.fileWriter(this.filePath, JSON.stringify({}, null, 2), "utf-8");
    }
  };

  writeMessage = (message: Messages) => {
    try {
      // Read current data
      const content = this.fileReader(this.filePath, "utf-8");

      const data = JSON.parse(content);

      const merged = { ...data, ...message };

      this.fileWriter(this.filePath, JSON.stringify(merged, null, 2), "utf-8");

      console.log("✅ File updated successfully.");
    } catch (err) {
      console.error("❌ Error updating JSON file:", err);
      throw err;
    }
  };
}
