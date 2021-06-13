import { IDbConfig } from "../types";

const nodeEnv = process.env.NODE_ENV as string;

let dbConfig: IDbConfig;
switch (nodeEnv) {
  case "development":
    dbConfig = {
      url: process.env.DEV_DATABASE_URI as string,
    };
    break;
  case "production":
    dbConfig = {
      url: process.env.PROD_DATABASE_URI as string,
    };
    break;
  default:
    dbConfig = {
      url: process.env.TEST_DATABASE_URI as string,
    };
}

export default dbConfig;
