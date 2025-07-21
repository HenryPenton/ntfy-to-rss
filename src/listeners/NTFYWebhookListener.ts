import crypto from "crypto";
import { JSONMessageWriter } from "../writers/JSONPropertyWriter";
import { IWebhookListener } from "./IWebhookListener";

export type Messages = {
  [k: string]: { message: string; time: number; guid: string };
};

export class NTFYWebhookListener implements IWebhookListener {
  constructor(private readonly messageWriter: JSONMessageWriter) {}

  private webhookHandler = async (event: MessageEvent<any>) => {
    const { data } = event;
    const { message, title, time } = JSON.parse(data);
    const guid = crypto.randomUUID();

    if (message && title) {
      this.messageWriter.writeMessage({ [title]: { message, time, guid } });
    }
  };

  listen = () => {
    const TOPIC = process.env.NTFY_TOPIC;
    const socket = new WebSocket(`wss://ntfy.sh/${TOPIC}/ws`);

    socket.addEventListener("message", this.webhookHandler);
  };
}
