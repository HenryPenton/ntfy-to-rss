import { Messages } from "../listeners/NTFYWebhookListener";

export interface IJSONMessageWriter {
  writeMessage: (message:Messages) => void;
}
