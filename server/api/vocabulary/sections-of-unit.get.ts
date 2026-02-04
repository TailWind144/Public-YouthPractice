import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import Joi from "joi"
import { generateCacheKey, getCache, setCache } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log("query", query)

  const schema = Joi.object({
    id: Joi.any().required(),
    unit: Joi.any().required(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const cacheKey = generateCacheKey("vocabulary:sections-unit", query)
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回Section列表")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    const [rows] = (await con.execute(
      `SELECT 
        vbs.id,
        title
      FROM vocabulary_book_section vbs
      WHERE vbs.unit_id = ?`,
      [query.unit]
    )) as any

    const data = rows.map((item: any) => ({
      value: item.id,
      label: item.title,
    }))

    await setCache(cacheKey, data)

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
