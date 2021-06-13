import { Request, Response, Router } from "express";

import { HelperMethods } from "../utils";
import { CacheData } from "../models";
import { IController, ICacheData } from "../types";

class CacheController implements IController {
  path: string;
  router: import("express").Router;

  constructor() {
    this.path = "/cacheData";
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(`${this.path}`, this.getAllCacheData);
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
}

export default CacheController;
