require("dotenv").config();
import { existsSync, readFileSync, writeFileSync } from "fs";
import { IWebhookListener } from "./listenerinterface";


type NTFYMessage = { title: string; message: string };
type StoredMessages = { [k: string]: string };

export class NTFYWebhookListener implements IWebhookListener {
  private readonly filePath = "./thing.json";
  constructor() {
    this.ensureFileExists();
  }

  private ensureFileExists = () => {
    if (!existsSync(this.filePath)) {
      writeFileSync(this.filePath, JSON.stringify({}, null, 2), "utf-8");
    }
  };

  private writeNextMessage = async (
    filePath: string,
    updates: StoredMessages
  ) => {
    try {
      // Read current data
      const content = readFileSync(filePath, "utf-8");
      console.log(content);
      const data = JSON.parse(content);

      // Merge properties
      const merged = { ...data, ...updates };

      writeFileSync(filePath, JSON.stringify(merged, null, 2), "utf-8");

      console.log("✅ File updated successfully.");
    } catch (err) {
      console.error("❌ Error updating JSON file:", err);
      throw err;
    }
  };

  private webhookHandler = async (event: MessageEvent<any>) => {
    const { data } = event;
    const { message, title } = JSON.parse(data);
    if (message && title) {
      const stringMessage = message.toString();
      const newMessage: StoredMessages = {};
      newMessage[title] = stringMessage;

      this.writeNextMessage(this.filePath, newMessage);
    }
  };

  listen = () => {
    this.ensureFileExists();

    const TOPIC = process.env.NTFY_TOPIC;
    const socket = new WebSocket(`wss://ntfy.sh/${TOPIC}/ws`);

    socket.addEventListener("message", this.webhookHandler);
  };
}

const listener = new NTFYWebhookListener();
listener.listen();
