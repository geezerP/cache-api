import { Schema, model } from "mongoose";

const CacheData = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  value: {
    type: String,
    required: true,
  },
  validTo: {
    type: Number,
  },
  createdAt: {
    type: Number,
  },
});

export default model("cacheData", CacheData);
