import { Redis } from "ioredis";
import { env } from "../env";

// BullMQ exige maxRetriesPerRequest: null
export const redisConnection = new Redis(env.redisUrl, {
  maxRetriesPerRequest: null,
});
