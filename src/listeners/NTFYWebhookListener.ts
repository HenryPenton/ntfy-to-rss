import { IJSONMessageWriter } from "../writers/IJSONPropertyWriter";
import { IWebhookListener } from "./IWebhookListener";

export type Messages = {
  [k: string]: { id: string; message: string; time: number };
};

type WebhookHandler = (event: MessageEvent<string>) => void;

export class NTFYWebhookListener implements IWebhookListener {
  constructor(
    private readonly messageSocket: WebSocket,
    private readonly webhookHandler: WebhookHandler
  ) {}

  listen = () => {
    this.messageSocket.addEventListener("message", this.webhookHandler);
  };
}

export const createWebhookHandler = (messageWriter: IJSONMessageWriter) => {
  const messageHandler = (event: MessageEvent<string>) => {
    const { data } = event;
    const { message, title, time, id } = JSON.parse(data);

    if (message && title) {
      messageWriter.writeMessage({ [title]: { message, time, id } });
    }
  };

  return messageHandler;
};
