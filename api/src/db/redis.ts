import Redis from "ioredis";

export async function publishToRedis(channel: string, message: string) {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

  const tempPublisher = new Redis(redisUrl, {
    lazyConnect: true,
    enableOfflineQueue: false,
  });

  try {
    await tempPublisher.connect();

    const result = await tempPublisher.publish(channel, message);
    return result;
  } finally {
    await tempPublisher.quit();
  }
}

export async function createSubscriber(): Promise<Redis> {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

  const subscriber = new Redis(redisUrl, {
    lazyConnect: true,
    enableOfflineQueue: false,
  });

  await subscriber.connect();
  return subscriber;
}
