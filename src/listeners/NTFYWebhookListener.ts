import { IJSONMessageWriter } from "../writers/IJSONPropertyWriter";
import { IWebhookListener } from "./IWebhookListener";

export type Messages = {
  [k: string]: { id: string; message: string; time: number };
};

export class NTFYWebhookListener implements IWebhookListener {
  constructor(
    private readonly messageWriter: IJSONMessageWriter,
    private messageSocket: WebSocket
  ) {}

  private webhookHandler = async (event: MessageEvent<any>) => {
    const { data } = event;
    const { message, title, time, id } = JSON.parse(data);

    if (message && title) {
      this.messageWriter.writeMessage({ [title]: { message, time, id } });
    }
  };

  listen = () => {
    this.messageSocket.addEventListener("message", this.webhookHandler);
  };
}
