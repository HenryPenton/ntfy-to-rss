import dotenv from "dotenv";
dotenv.config();

import { config } from "./configuration";
import { NTFYWebhookListener } from "./listeners/NTFYWebhookListener";
import { Server } from "./rss/Server";
import { JSONMessageWriter } from "./writers/JSONPropertyWriter";

const messageLocation = "./messages.json";

const ntfy = new NTFYWebhookListener(
  new JSONMessageWriter(messageLocation),
  config
);
const server = new Server(3000, messageLocation, config);
ntfy.listen();
server.listen();
