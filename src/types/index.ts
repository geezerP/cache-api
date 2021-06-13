import { Router } from "express";

export interface IServerConfig {
  port: number;
  env: string;
}

export interface IController {
  path: string;
  router: Router;
}

export interface IDbConfig {
  url: string;
}

export interface ICacheDataConfig {
  ttl: number;
  maxNumberOfEntries: number;
}

export interface ICacheData {
  key: string;
  value: string;
  validTo: number;
  createdAT: number;
  get(value: string): any;
  updateOne: (arg0: { value: string }) => any;
  any: any;
}
