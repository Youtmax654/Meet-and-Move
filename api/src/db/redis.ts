import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

/**
 * Publisher instance — used to publish messages to Redis channels.
 */
export const publisher = new Redis(redisUrl);

/**
 * Creates a new subscriber instance.
 * Each SSE connection needs its own subscriber because ioredis
 * puts a client in "subscriber mode" once subscribe() is called.
 */
export function createSubscriber() {
  return new Redis(redisUrl);
}
