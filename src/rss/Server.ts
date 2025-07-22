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
    const siteUrlString =
      this.configuration.getConfigurationVariable("siteURL");
    const siteUrl = new URL(siteUrlString);
    const feedUrl = new URL("/rss/feed.xml", siteUrlString);

    const feed = new RSS({
      title: "My feed",
      feed_url: feedUrl.href,
      site_url: siteUrl.href,
    });

    for (const [key, value] of Object.entries(messages)) {
      const { id, message, time } = value;
      feed.item({
        title: `${key}: ${message}`,
        description: message,
        url: `/message/${id}.json`,
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

    this.app.get("/", (req, res) => {
      res.redirect("/rss/feed.xml");
    });
  };

  listen = () => {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  };
}
