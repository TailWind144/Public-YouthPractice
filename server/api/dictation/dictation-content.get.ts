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

  const cacheKey = generateCacheKey("dictation:content", query)
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回听写详情信息")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    const { id } = query
    const [taskRows] = (await con.execute(
      "SELECT title, time, max_play_count as maxPlayCount FROM dictation_task WHERE id = ?",
      [id]
    )) as any
    if (!taskRows.length) return responseJson(event, 403, "题目不存在", {})

    const [rows] = (await con.execute(
      "SELECT * FROM dictation_task_words WHERE task_id = ?",
      [id]
    )) as any

    const data = {
      ...taskRows[0],
      data: rows,
    }

    await setCache(cacheKey, data)

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
