import { NTFYWebhookListener } from "./listeners/NTFYWebhookListener";
import { Server } from "./rss/Server";
import { JSONMessageWriter } from "./writers/JSONPropertyWriter";
require("dotenv").config();

const ntfy = new NTFYWebhookListener(new JSONMessageWriter("./messages.json"));
const server = new Server(3000, "./");
ntfy.listen();
server.listen();
