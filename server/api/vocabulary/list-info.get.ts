import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import Joi from "joi"
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
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const uid = event.context.uid
    const [authRows] = (await con.execute(
      "SELECT * FROM vocabulary_book WHERE id = ? AND user_id = ?",
      [query.id, uid]
    )) as any
    if (!authRows.length) return responseJson(event, 403, "无权限", {})

    const cacheKey = generateCacheKey("vocabulary:custom-list-info", query)
    const cache = await getCache(cacheKey)
    if (cache) {
      console.log("使用缓存返回自定义词库信息")
      return responseJson(event, 200, "ok", cache)
    }

    const [rows] = (await con.execute(
      "SELECT vocabulary_book.id AS id, title, remark, vocabulary_book.create_time as createTime, vocabulary_book.update_time as updateTime, COUNT(vocabulary_book_words.book_id) AS total FROM vocabulary_book LEFT JOIN vocabulary_book_words ON vocabulary_book.id = vocabulary_book_words.book_id WHERE vocabulary_book.id = ? GROUP BY vocabulary_book.id, vocabulary_book.update_time ORDER BY vocabulary_book.update_time DESC",
      [query.id]
    )) as any

    for (const row of rows) {
      row.createTime = formatSmartDateTime(row.createTime)
      row.updateTime = formatSmartDateTime(row.updateTime)
    }

    await setCache(cacheKey, rows[0], 7200)

    return responseJson(event, 200, "ok", rows[0])
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
