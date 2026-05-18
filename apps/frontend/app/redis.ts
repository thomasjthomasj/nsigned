import IORedis from "ioredis";

export const revalidate = 3600;

let redisInstance: IORedis | null = null;

const { REDIS_URL } = process.env;

export const getRedis = () => {
  if (redisInstance) return redisInstance;
  if (!REDIS_URL) throw new Error("Redis not configured");
  redisInstance = new IORedis(REDIS_URL);

  return redisInstance;
};

export const setCache = async (key: string, value: any, expiry: number) => {
  const encoded = JSON.stringify(value);
  const redis = getRedis();
  await redis.set(key, encoded, "EX", expiry);
};

export const getFromCache = async (key: string) => {
  const redis = getRedis();
  const raw = await redis.get(key);
  if (raw) return JSON.parse(raw as string);
  return null;
};
