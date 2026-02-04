import dayjs from "dayjs"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { generateCacheKey, getCache, setCache } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const uid = event.context.uid
  const today = dayjs().format("YYYY-MM-DD")

  const cacheKey = generateCacheKey("common:is-checkin", { uid, today })
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回今日已签到信息")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    const [rows] = (await con.execute(
      "SELECT * FROM user_checkins where user_id = ? and checkin_date = ?",
      [uid, today]
    )) as any

    const data = { isCheckin: rows.length ? true : false }
    if (data.isCheckin) await setCache(cacheKey, data, 60 * 60 * 6)

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
