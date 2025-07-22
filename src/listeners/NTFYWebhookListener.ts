import crypto from "crypto";
import { JSONMessageWriter } from "../writers/JSONPropertyWriter";
import { IWebhookListener } from "./IWebhookListener";
import { IConfiguration } from "../configuration";

export type Messages = {
  [k: string]: { id: string; message: string; time: number };
};

export class NTFYWebhookListener implements IWebhookListener {
  constructor(
    private readonly messageWriter: JSONMessageWriter,
    private readonly configuration: IConfiguration
  ) {}

  private webhookHandler = async (event: MessageEvent<any>) => {
    const { data } = event;
    const { message, title, time, id } = JSON.parse(data);

    if (message && title) {
      this.messageWriter.writeMessage({ [title]: { message, time, id } });
    }
  };

  listen = () => {
    const TOPIC = this.configuration.getConfigurationVariable("ntfyTopic");
    const socket = new WebSocket(`wss://ntfy.sh/${TOPIC}/ws`);

    socket.addEventListener("message", this.webhookHandler);
  };
}
