import { existsSync, readFileSync, writeFileSync } from "fs";
import { IJSONMessageWriter } from "./IJSONPropertyWriter";
export type StoredMessages = { [k: string]: string };

export class JSONMessageWriter implements IJSONMessageWriter {
  constructor(private readonly filePath: string) {
    this.ensureFileExists();
  }

  private ensureFileExists = () => {
    if (!existsSync(this.filePath)) {
      writeFileSync(this.filePath, JSON.stringify({}, null, 2), "utf-8");
    }
  };

  writeProperty = (key: string, value: string) => {
    try {
      // Read current data
      const content = readFileSync(this.filePath, "utf-8");

      const data = JSON.parse(content);

      // Merge properties
      const newMessage: StoredMessages = {};
      newMessage[key] = value;

      const merged = { ...data, ...newMessage };

      writeFileSync(this.filePath, JSON.stringify(merged, null, 2), "utf-8");

      console.log("✅ File updated successfully.");
    } catch (err) {
      console.error("❌ Error updating JSON file:", err);
      throw err;
    }
  };
}
