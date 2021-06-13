import { IServerConfig } from "../types";

const serverConfig: IServerConfig = {
  env: process.env.NODE_ENV as string,
  port: (process.env.SERVER_PORT || 4000) as number,
};

export default serverConfig;
