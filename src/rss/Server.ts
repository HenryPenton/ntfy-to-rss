import express from "express";
import { readFileSync } from "fs";
import path from "path";
import RSS from "rss";
import { Messages } from "../listeners/NTFYWebhookListener";
import { IServer } from "./iServer";
import { IConfiguration } from "../configuration";

export class Server implements IServer {
  private app: express.Express;

  constructor(
    private readonly port: number,
    private readonly messageLocation: string,
    private readonly configuration: IConfiguration
  ) {
    this.app = express();
    this.setUpEndpoints();
  }

  private buildFeed = (messages: Messages) => {
    const siteUrl = this.configuration.getConfigurationVariable("siteURL");
    const feed = new RSS({
      title: "My feed",
      feed_url: siteUrl,
      site_url: siteUrl,
    });

    for (const [key, value] of Object.entries(messages)) {
      const { id, message, time } = value;
      feed.item({
        title: `${key}: ${message}`,
        description: message,
        url: path.join(`/message/${id}.json`),
        date: new Date(time * 1000),
        guid: id,
      });
    }
    return feed.xml({ indent: true });
  };

  private setUpEndpoints = () => {
    this.app.get("/rss/feed.xml", (req, res) => {
      const messagesPath = this.messageLocation;

      const jsonFile = readFileSync(messagesPath, "utf-8");
      const parsedJSON = JSON.parse(jsonFile);
      const xmlMessages = this.buildFeed(parsedJSON);

      res.setHeader("Content-Type", "application/xml");
      res.send(xmlMessages);
    });

    this.app.get("/message/:message.json", (req, res) => {
      const { message } = req.params;
      const messagesPath = this.messageLocation;

      const jsonFile = readFileSync(messagesPath, "utf-8");
      const parsedJSON: Messages = JSON.parse(jsonFile);

      const messageMap = new Map<string, Messages[number]>();

      for (const [key, value] of Object.entries(parsedJSON)) {
        messageMap.set(value.id, value);
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
