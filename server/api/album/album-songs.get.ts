import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { generateCacheKey, getCache, setCache } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log("query", query)

  const schema = Joi.object({
    id: Joi.any().required(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    console.error("参数验证失败:", e)
    return responseJson(event, 400, "参数错误", {})
  }

  const cacheKey = generateCacheKey("album:album-songs", query)
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回专辑列表")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    // 获取专辑信息
    const [albumRows] = (await con.execute(
      "SELECT id, title, intro, cover, title_cn as titleCn FROM media_library where id = ?",
      [query.id]
    )) as any

    if (!albumRows || albumRows.length === 0) {
      return responseJson(event, 404, "专辑未找到", {})
    }

    // 获取音乐列表
    const [musicRows] = (await con.execute(
      "SELECT id, title, singer, resource, lyrics FROM media_music WHERE media_id = ?",
      [query.id]
    )) as any

    const result = {
      album: albumRows[0],
      songs: musicRows,
    }

    await setCache(cacheKey, result, 7200)

    return responseJson(event, 200, "ok", result)
  } catch (e: any) {
    console.error("服务器错误:", e)
    return responseJson(event, 500, e.message || "服务器内部错误", {})
  } finally {
    con.release()
  }
})
