import express from "express";
import { readFileSync } from "fs";
import path from "path";
import { IServer } from "./iServer";
import RSS from "rss";
import { StoredMessages } from "../writers/JSONPropertyWriter";
export class Server implements IServer {
  private app: express.Express;

  constructor(
    private readonly port: number,
    private readonly fileRoot: string
  ) {
    this.app = express();
    this.setUpEndpoints();
  }

  private buildFeed = (messages: StoredMessages) => {
    const feed = new RSS({
      title: "My feed",
      feed_url: "",
      site_url: "",
    });

    for (const [key, value] of Object.entries(messages)) {
      feed.item({
        title: `${key}: ${value}`,
        description: value,
        url: "",
        date: new Date(),
      });
    }
    return feed.xml();
  };

  private setUpEndpoints = () => {
    this.app.get("/rss/:rssRoute", (req, res) => {
      const { rssRoute } = req.params;

      const jsonFile = readFileSync(
        `${path.join(this.fileRoot, rssRoute)}.json`,
        "utf-8"
      );
      const parsedJSON = JSON.parse(jsonFile);
      const xmlMessages = this.buildFeed(parsedJSON);

      res.set("Content-Type", "text/xml");
      res.send(xmlMessages);
    });
  };

  listen = () => {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  };
}
