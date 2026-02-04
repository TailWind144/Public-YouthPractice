import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { generateCacheKey, getCache, setCache } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const uid = event.context.uid
  const cacheKey = generateCacheKey("vocabulary:custom-list", { uid })
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回自定义词库列表")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    const [rows] = (await con.execute(
      "SELECT vocabulary_book.id AS id, title, remark, vocabulary_book.update_time as updateTime, COUNT(*) AS total FROM vocabulary_book LEFT JOIN vocabulary_book_words ON vocabulary_book.id = vocabulary_book_words.book_id WHERE user_id = ? GROUP BY vocabulary_book.id, vocabulary_book.update_time ORDER BY vocabulary_book.update_time DESC",
      [uid]
    )) as any

    for (const row of rows) {
      row.updateTime = formatSmartDateTime(row.updateTime)
    }

    await setCache(cacheKey, rows, 7200)

    return responseJson(event, 200, "ok", rows)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
