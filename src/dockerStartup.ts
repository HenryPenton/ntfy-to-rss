import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { config } from "./configuration";
import {
  createWebhookHandler,
  NTFYWebhookListener,
} from "./listeners/NTFYWebhookListener";
import { Server } from "./rss/Server";
import { JSONMessageWriter } from "./writers/JSONPropertyWriter";
import { NodeFileSystem } from "./fileSystem/NodeFileSystem";

const messageLocation = "/app/messages/messages.json";
const TOPIC = config.getConfigurationVariable("ntfyTopic");
const socket = new WebSocket(`wss://ntfy.sh/${TOPIC}/ws`);
const fileSystem = new NodeFileSystem(
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync
);

const webhookHandler = createWebhookHandler(
  new JSONMessageWriter(messageLocation, fileSystem)
);
const ntfy = new NTFYWebhookListener(socket, webhookHandler);
const server = new Server(3000, messageLocation, config);

ntfy.listen();
server.listen();
