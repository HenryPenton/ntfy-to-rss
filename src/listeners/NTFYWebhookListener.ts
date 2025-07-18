import { JSONMessageWriter } from "../writers/JSONPropertyWriter";
import { IWebhookListener } from "./IWebhookListener";

export class NTFYWebhookListener implements IWebhookListener {
  constructor(private readonly messageWriter: JSONMessageWriter) {}

  private webhookHandler = async (event: MessageEvent<any>) => {
    const { data } = event;
    const { message, title } = JSON.parse(data);

    if (message && title) {
      this.messageWriter.writeProperty(title, message);
    }
  };

  listen = () => {
    const TOPIC = process.env.NTFY_TOPIC;
    const socket = new WebSocket(`wss://ntfy.sh/${TOPIC}/ws`);

    socket.addEventListener("message", this.webhookHandler);
  };
}
