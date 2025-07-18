import express from "express";
import { IServer } from "./iServer";
import { readFileSync } from "fs";
import path from "path";

export class Server implements IServer {
  private app: express.Express;

  constructor(
    private readonly port: number,
    private readonly fileRoot: string
  ) {
    this.app = express();
    this.setUpEndpoints();
  }

  private setUpEndpoints = () => {
    this.app.get("/rss/:rssRoute", (req, res) => {
      const { rssRoute } = req.params;
      console.log(`${path.join(this.fileRoot, rssRoute)}.json`);
      const x = readFileSync(
        `${path.join(this.fileRoot, rssRoute)}.json`,
        "utf-8"
      );
      res.json(JSON.parse(x));
    });
  };

  listen = () => {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  };
}
