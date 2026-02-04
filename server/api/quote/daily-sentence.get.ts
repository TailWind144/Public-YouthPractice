import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import dayjs from "dayjs"
import { quoteTimeFormat } from "~/server/utils/const"
import { generateCacheKey, getCache, setCache } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const cacheKey = generateCacheKey("quote:daily-sentence", {
    date: dayjs().format(quoteTimeFormat),
  })
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回每日一句")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    const [rows] = (await con.execute(
      "SELECT id, en, cn, origin_en as originEn, origin_cn as originCn, publish_time as publishTime, link, type FROM quote_info WHERE publish_time = CURDATE()"
    )) as any

    // const [isLoveRows] = (await con.execute(
    //   "SELECT * FROM quote_collect WHERE user_id = ? and quote_id = ?",
    //   [uid, rows[0].id]
    // )) as any

    // const [wordsRow] = (await con.execute(
    //   "SELECT * FROM quote_words WHERE quote_id = ?",
    //   [rows[0].id]
    // )) as any

    // rows[0].isLove = isLoveRows.length !== 0
    rows[0].publishTime = dayjs(rows[0].publishTime).format(quoteTimeFormat)
    // rows[0].words = wordsRow

    await setCache(cacheKey, rows[0], 60 * 60 * 6)

    return responseJson(event, 200, "ok", rows[0])
  } catch (e: any) {
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
