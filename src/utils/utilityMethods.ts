import { cacheDataConfig } from "../config";

export default class HelperMethods {
  static generateRandomString() {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < 30; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  static generateTTL() {
    const newDate = new Date();
    newDate.setMinutes(newDate.getMinutes() + cacheDataConfig.ttl);

    return newDate.getTime();
  }
}
