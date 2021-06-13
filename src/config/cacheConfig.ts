import { ICacheDataConfig } from "../types";

const cacheDataConfig: ICacheDataConfig = {
  ttl: (process.env.TTL_IN_MINS || 60) as number,
  maxNumberOfEntries: (process.env.MAX_NUMBER_OF_ENTIRES || 10) as number,
};

export default cacheDataConfig;
