import express from "express";
import { readFileSync } from "fs";
import path from "path";
import RSS from "rss";
import { Messages } from "../listeners/NTFYWebhookListener";
import { IServer } from "./iServer";

export class Server implements IServer {
  private app: express.Express;

  constructor(
    private readonly port: number,
    private readonly fileRoot: string
  ) {
    this.app = express();
    this.setUpEndpoints();
  }

  private buildFeed = (messages: Messages) => {
    const feed = new RSS({
      title: "My feed",
      feed_url: process.env.SITE_URL || "",
      site_url: process.env.SITE_URL || "",
    });

    for (const [key, value] of Object.entries(messages)) {
      const { guid, message, time } = value;
      feed.item({
        title: `${key}: ${message}`,
        description: message,
        url: path.join(process.env.SITE_URL || "", `/message/${guid}.json`),
        date: new Date(time * 1000),
        guid: guid,
      });
    }
    return feed.xml({ indent: true });
  };

  private setUpEndpoints = () => {
    this.app.get("/rss/feed.xml", (req, res) => {
      const messagesPath = `${path.join(this.fileRoot, "messages")}.json`;

      const jsonFile = readFileSync(messagesPath, "utf-8");
      const parsedJSON = JSON.parse(jsonFile);
      const xmlMessages = this.buildFeed(parsedJSON);

      res.setHeader("Content-Type", "application/xml");
      res.send(xmlMessages);
    });

    this.app.get("/message/:message.json", (req, res) => {
      const { message } = req.params;
      const messagesPath = `${path.join(this.fileRoot, "messages")}.json`;

      const jsonFile = readFileSync(messagesPath, "utf-8");
      const parsedJSON: Messages = JSON.parse(jsonFile);

      const messageMap = new Map<string, Messages[number]>();

      for (const [key, value] of Object.entries(parsedJSON)) {
        messageMap.set(value.guid, value);
      }

      res.json(messageMap.get(message));
    });
  };

  listen = () => {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  };
}
