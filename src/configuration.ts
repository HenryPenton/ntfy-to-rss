import { Configuration } from "config-captain";

export const config = new Configuration(
  {},
  { ntfyTopic: "NTFY_TOPIC", siteURL: "SITE_URL" },
  [process.env]
);

export type IConfiguration = typeof config;
