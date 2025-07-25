import path from "path";
import { Messages } from "../listeners/NTFYWebhookListener";
import { IJSONMessageWriter } from "./IJSONPropertyWriter";
import { IFileSystem } from "../fileSystem/IFileSystem";

export class JSONMessageWriter implements IJSONMessageWriter {
  constructor(
    private readonly filePath: string,
    private readonly fileSystem: IFileSystem
  ) {
    this.ensureFileExists();
  }

  private ensureFileExists = () => {
    if (!this.fileSystem.checkFileExists(this.filePath)) {
      this.fileSystem.makeDirectoryForFile(this.filePath);
      this.fileSystem.writeJSONFile(this.filePath, {});
    }
  };

  writeMessage = (message: Messages) => {
    try {
      this.ensureFileExists();
      const data = this.fileSystem.readJSONFile(this.filePath);
      
      const merged = { ...data, ...message };
      this.fileSystem.writeJSONFile(this.filePath, merged);

      console.log("✅ File updated successfully.");
    } catch (err) {
      console.error("❌ Error updating JSON file:", err);
      throw err;
    }
  };
}
