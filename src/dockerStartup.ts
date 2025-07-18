import { NTFYWebhookListener } from "./listeners/NTFYWebhookListener";
import { Server } from "./rss/Server";
import { JSONMessageWriter } from "./writers/JSONPropertyWriter";

const ntfy = new NTFYWebhookListener(new JSONMessageWriter("/app/messages.json"));
const server = new Server(3000, "/app");
ntfy.listen();
server.listen();
