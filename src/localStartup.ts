import { NTFYWebhookListener } from "./listeners/NTFYWebhookListener";
import { JSONMessageWriter } from "./writers/JSONPropertyWriter";

require("dotenv").config();

const ntfy = new NTFYWebhookListener(new JSONMessageWriter());
ntfy.listen();
