import Redis from "ioredis"

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || "",
  connectTimeout: 5000,
}

const redis = new Redis(redisConfig)

redis.on("connect", () => {
  console.log("Redis 连接成功")
})

redis.on("error", (err) => {
  console.error("Redis 连接失败:", err.message)
})

export default redis
