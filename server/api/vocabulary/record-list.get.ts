import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import dayjs from "dayjs"
import { generateCacheKey, getCache, setCache } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const uid = event.context.uid
  const cacheKey = generateCacheKey("vocabulary:record-list", { uid })
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回词库记录")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    const [rows] = (await con.execute(
      "SELECT vr.*, vb.title as title, vb.cover as cover, vb.remark as remark FROM vocabulary_record as vr, vocabulary_book as vb WHERE vr.user_id = ? AND vr.book_id = vb.id ORDER BY vr.update_time DESC",
      [uid]
    )) as any

    const data = []
    for (const row of rows) {
      row.update_time = dayjs(row.update_time).format("YYYY-MM-DD")
      const recordId = row.id
      const [wordsRows] = (await con.execute(
        "SELECT * FROM vocabulary_list WHERE record_id = ?",
        [recordId]
      )) as any
      const total = wordsRows.length
      let masteredSum = 0
      let ongoningSum = 0
      let notLearnSum = 0
      let reviewCount = 0

      for (const word of wordsRows) {
        if (word.status === 2) masteredSum++
        else if (word.status === 1) ongoningSum++
        if (word.status === 0) notLearnSum++
        if (
          word.status === 1 &&
          word.next_review_time &&
          new Date(word.next_review_time) <= new Date()
        ) {
          reviewCount++
        }
      }

      data.push({
        ...row,
        total,
        masteredSum,
        ongoningSum,
        notLearnSum,
        reviewCount,
      })
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
