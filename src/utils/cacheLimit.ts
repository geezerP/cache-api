import { cacheDataConfig } from "../config";
import { CacheData } from "../models";
import { HelperMethods } from ".";

/**
 * Method handles max number of entries in cache.
 * If limit is exceeded, then remove entry with TTL which is
 * about to finish or already finished or the creation time is oldest
 * @param {string} key
 * @param {string} value
 * @returns {boolean}
 */
async function cacheLimit(key: string, value: string): Promise<boolean> {
  const count = await CacheData.countDocuments();

  if (count < cacheDataConfig.maxNumberOfEntries) {
    return false;
  }

  const entry = await CacheData.find({})
    .sort({
      validTo: 1,
      createdAt: 1,
    })
    .findOne()
    .exec();
  if (!entry) {
    return false;
  }

  await entry.updateOne({
    key,
    value,
    validTo: HelperMethods.generateTTL(),
    createdAt: new Date().getTime(),
  });

  return true;
}

export default cacheLimit;
