import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import Joi from "joi"
import { getCache, setCache } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log("query", query)

  const schema = Joi.object({
    isUser: Joi.any().optional(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }
  const { isUser } = query

  const cacheKey = "vocabulary:book-options"
  if (!isUser) {
    const cache = await getCache(cacheKey)
    if (cache) {
      console.log("使用缓存返回系统词库选项")
      return responseJson(event, 200, "ok", cache)
    }
  }

  const con = await getDB()
  try {
    const uid = event.context.uid
    let sql = "SELECT * FROM vocabulary_book WHERE is_system = 1"
    const params = []
    if (isUser) {
      sql = "SELECT * FROM vocabulary_book WHERE user_id = ?"
      params.push(uid)
    }

    const [rows] = (await con.execute(sql, params)) as any

    if (!isUser) await setCache(cacheKey, rows, 7200)

    return responseJson(event, 200, "ok", rows)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
