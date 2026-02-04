import redis from "./redis"

/**
 * 获取缓存
 * @param key 缓存键名
 * @returns 解析后的缓存数据（无缓存返回null）
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get(key)
  if (!data) return null
  return JSON.parse(data) as T // Redis存储字符串，需反序列化
}

/**
 * 设置缓存
 * @param key 缓存键名
 * @param data 缓存数据（会自动序列化为JSON）
 * @param expire 过期时间（秒，默认1小时）
 */
export async function setCache<T>(key: string, data: T, expire = 3600) {
  await redis.set(key, JSON.stringify(data), "EX", expire)
}

/**
 * 删除缓存
 * @param key 缓存键名
 */
export async function delCache(key: string) {
  await redis.del(key)
}

export function generateCacheKey(
  prefix: string,
  params: Record<string, any>
): string {
  const validParams = Object.entries(params).filter(
    ([_, value]) => value != null
  )
  const sortedParams = validParams.sort(([keyA], [keyB]) =>
    keyA.localeCompare(keyB)
  )
  const paramStr = sortedParams
    .map(([key, value]) => `${key}=${value}`)
    .join(":")

  return `${prefix}:${paramStr}`
}
