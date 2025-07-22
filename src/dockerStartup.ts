import { config } from "./configuration";
import { NTFYWebhookListener } from "./listeners/NTFYWebhookListener";
import { Server } from "./rss/Server";
import { JSONMessageWriter } from "./writers/JSONPropertyWriter";

const messageLocation = "/app/messages/messages.json";
const TOPIC = config.getConfigurationVariable("ntfyTopic");
const socket = new WebSocket(`wss://ntfy.sh/${TOPIC}/ws`);

const ntfy = new NTFYWebhookListener(
  new JSONMessageWriter(messageLocation),
  socket
);
const server = new Server(3000, messageLocation, config);

ntfy.listen();
server.listen();
