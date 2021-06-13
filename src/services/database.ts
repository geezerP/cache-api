import { Db } from "mongodb";
import mongoose from "mongoose";

import { dbConfig } from "../config";

export default class DbServices {
  static async initDb(): Promise<Db> {
    return new Promise((resolve, reject) => {
      mongoose.connect(dbConfig.url, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      mongoose.connection.once("open", async () => {
        console.log(`Connected to db at ${dbConfig.url}`);
        resolve(mongoose.connection.db);
      });
    });
  }
}
