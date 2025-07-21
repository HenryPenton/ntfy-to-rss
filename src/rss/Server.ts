import express from "express";
import { readFileSync } from "fs";
import path from "path";
import { IServer } from "./iServer";
import RSS from "rss";
import { Messages } from "../listeners/NTFYWebhookListener";

import crypto from "crypto";

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
      feed_url: "",
      site_url: "",
    });

    for (const [key, value] of Object.entries(messages)) {
      const guid = crypto.randomUUID();
      feed.item({
        title: `${key}: ${value.message}`,
        description: value.message,
        url: `https://duckduckgo.com/${guid}`,
        date: new Date(value.time * 1000),
        guid,
      });
    }
    return feed.xml({ indent: true });
  };

  private setUpEndpoints = () => {
    this.app.get("/rss/:rssFeed.xml", (req, res) => {
      const { rssFeed } = req.params;
      const messagesPath = `${path.join(this.fileRoot, rssFeed)}.json`;

      const jsonFile = readFileSync(messagesPath, "utf-8");
      const parsedJSON = JSON.parse(jsonFile);
      const xmlMessages = this.buildFeed(parsedJSON);

      res.setHeader("Content-Type", "application/xml");
      res.send(xmlMessages);
    });
  };

  listen = () => {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  };
}
