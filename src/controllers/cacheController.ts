import winston from "winston";
import { Request, Response, Router } from "express";

import { HelperMethods, cacheLimit } from "../utils";
import { CacheData } from "../models";
import { IController, ICacheData } from "../types";

const logConfiguration = {
  transports: [
    // Log to the console
    new winston.transports.Console({
      level: "warn",
    }),

    // Log to a file for future reference
    new winston.transports.File({
      level: "error",
      // Create the log directory if it does not exist
      filename: "logs/cache.log",
    }),
  ],
};

const logger = winston.createLogger(logConfiguration);
class CacheController implements IController {
  path: string;
  router: import("express").Router;

  constructor() {
    this.path = "/cache";
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(`${this.path}/:key`, this.getCache);
    this.router.get(`${this.path}`, this.getAllCacheData);
    this.router.post(`${this.path}/:key`, this.createOrUpdateCache);
    this.router.delete(`${this.path}/:key`, this.removeCache);
    this.router.delete(`${this.path}`, this.removeAllCacheData);
  }

  /**
   * Fetch all the cache data stored in the CacheData collection
   * Returns an object with the keys and their values and a response message
   * @returns { Object } Object
   */
  async getAllCacheData(_: Request, res: Response) {
    const currentTime = new Date().getTime();
    const entries = await CacheData.find({});
    const keys = await Promise.all(
      entries.map(async (entry: ICacheData) => {
        if (entry.get("validTo") < currentTime) {
          const newValue = HelperMethods.generateRandomString();
          await entry.updateOne({
            value: newValue,
          });

          return newValue;
        }

        return entry.get("key");
      })
    );

    return res.json({
      data: keys,
      message: "Cached keys retrieved successfully!",
    });
  }

  /**
   * GET one cache Entry from the CacheData collection if it exists.
   * If cache doesn't exist method creates it and returns its value and response message object
   * Returns an object with the Keys and a response message
   * @param { String } Key
   * @returns { Object } key value and response message object
   */
  async getCache(req: Request, res: Response) {
    const { key } = req.params;

    let cacheEntry = await CacheData.findOne({
      key,
    });

    if (!cacheEntry) {
      logger.warn("Cache miss");
      logger.error("Cache miss");
      const randStr = HelperMethods.generateRandomString();
      const result = await cacheLimit(key, randStr);
      if (!result) {
        cacheEntry = new CacheData({
          key,
          value: randStr,
          validTo: HelperMethods.generateTTL(),
          createdAt: new Date().getTime(),
        });
        await cacheEntry.save();
      }

      return res.status(200).json({
        message: "Cache retrived successfully!",
        data: randStr,
      });
    } else {
      logger.warn("Cache hit");
      logger.error("Cache hit");
      await cacheEntry.updateOne({
        validTo: HelperMethods.generateTTL(),
      });

      return res.status(200).json({
        message: "Chache retrived successfully!",
        data: cacheEntry.get("value"),
      });
    }
  }

  /**
   * POST || UPDATE cache value entry on the CacheData collection if the key exists.
   * If key doesn't exist we create it and update the CacheData collection
   * @param { string } key
   * @param { string } value
   * @returns { Object } response Message
   */
  async createOrUpdateCache(req: Request, res: Response) {
    const { key } = req.params;
    const { value } = req.body;

    let cacheEntry = await CacheData.findOne({
      key,
    });

    if (!cacheEntry) {
      const result = await cacheLimit(key, value);
      if (!result) {
        cacheEntry = new CacheData({
          key,
          value,
          validTo: HelperMethods.generateTTL(),
          createdAt: new Date().getTime(),
        });
        await cacheEntry.save();
      }

      return res.status(201).json({
        message: "Cache added successfully!",
      });
    } else {
      await cacheEntry.updateOne({
        value,
      });

      return res.status(200).json({
        message: "Cache is updated successfully!",
      });
    }
  }

  /**
   * DELETE cache value entry on the CacheData collection if the key exists.
   * If the user hasn't provided the key to remove ask then to provide the key
   * Check if the key exists in the database. If it is not there inform the user.
   * If Key exists we delete the key
   * @param { string } key
   * @returns { Object } response Message
   */
  async removeCache(req: Request, res: Response) {
    const { key } = req.params;
    if (!key) {
      return res.status(400).json({
        message: "Kindly provide cache Key to remove!",
      });
    }

    const cacheEntry = await CacheData.findOne({
      key,
    });
    if (!cacheEntry) {
      return res.status(404).json({
        message: "Key not found in the database!",
      });
    }
    await CacheData.deleteOne({
      key,
    });

    return res.status(200).json({
      message: "Cache removed successfully!",
    });
  }

  /**
   * DELETE all cache entries from the  CacheData collection.
   * @returns { Object } response Message
   */
  async removeAllCacheData(_: Request, res: Response) {
    await CacheData.deleteMany({}).exec();

    return res.status(200).json({
      message: "All keys removed from cache successfully!",
    });
  }
}

export default CacheController;
