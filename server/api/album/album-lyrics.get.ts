import { defineEventHandler, getQuery } from "h3"
import Joi from "joi"
import getDB from "@/server/db/mysql"
import { generateCacheKey, getCache, setCache } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const schema = Joi.object({
    musicId: Joi.any().required(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const cacheKey = generateCacheKey("album:album-lyrics", query)
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回歌词信息")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    const musicId = query.musicId as string
    // 查询指定music_id的歌词数据，按index排序
    const [rows] = await con.execute(
      "SELECT id, music_id, `index`, timestamp, lyrics_en, lyrics_cn FROM media_lyrics WHERE music_id = ? ORDER BY `index` ASC",
      [musicId]
    )

    await setCache(cacheKey, rows, 7200)

    return responseJson(event, 200, "ok", rows)
  } catch (e: any) {
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
