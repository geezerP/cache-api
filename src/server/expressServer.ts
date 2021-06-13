import dotenv from "dotenv";
dotenv.config();

import compression from "compression";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import { Server } from "http";

import { serverConfig } from "../config";
import { IController } from "../types";

export default class ExpressServer {
  app: Express;
  private startMessage: string;
  private server: Server;
  private started: boolean;

  constructor(
    startMessage: string = `Server started at port ${serverConfig.port}`
  ) {
    this.startMessage = startMessage;
    this.started = false;
    this.init();
  }

  start() {
    this.server = this.app.listen(serverConfig.port, () => {
      this.started = true;
      console.log(this.startMessage);
    });

    return this.server;
  }

  isRuning() {
    return this.started;
  }

  addControllers(controllers: IController[]) {
    controllers.map((controller) => {
      this.app.use("/api", controller.router);
    });
  }

  stop() {
    if (!this.server) {
      throw new Error("Server is not runnign!");
    }

    this.started = false;
    this.server.close();
  }

  private init() {
    this.app = express();
    this.setMiddlewares();
  }

  private setMiddlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(helmet());
  }
}
