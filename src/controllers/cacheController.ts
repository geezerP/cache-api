import { IController } from "../types";

class CacheController implements IController {
  path: string;
  router: import("express").Router;

  constructor() {
  }

}

export default CacheController;
