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
    return responseJson(event, 400, "参数错误", {})
  }

  const cacheKey = generateCacheKey("game:media-exercises", query)
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回视频练习信息")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    const [rows] = (await con.execute(
      "SELECT * FROM media_exercises where chapter_id = ?",
      [query.id]
    )) as any

    const data: {
      multiples: any[]
      kind: string
      answersLength?: number
    } = {
      multiples: [],
      kind: "options",
    }
    for (const row of rows) {
      const temp = []
      for (const key of Object.keys(row)) {
        if (key.startsWith("op") && row[key]) {
          temp.push({ label: row[key], value: optionToStr[key] })
        }
      }
      data.multiples.push({ question: row.question, options: temp })
    }

    await setCache(cacheKey, data, 7200)

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
