import dayjs from "dayjs"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const con = await getDB()

  try {
    const uid = event.context.uid
    const today = dayjs()

    const [todayCheckin] = (await con.execute(
      "SELECT * FROM user_checkins where user_id = ? and checkin_date = ?",
      [uid, today.format("YYYY-MM-DD")]
    )) as any
    const yesterday = today.subtract(1, "day")
    const [yesterdayCheckin] = (await con.execute(
      "SELECT * FROM user_checkins where user_id = ? and checkin_date = ?",
      [uid, yesterday.format("YYYY-MM-DD")]
    )) as any
    const streak = todayCheckin[0]?.streak || yesterdayCheckin[0]?.streak || 0

    const [rows2] = (await con.execute(
      "SELECT level_id FROM practice_user_level, practice_level  WHERE user_id = ? AND practice_level.id = practice_user_level.level_id GROUP BY level_id",
      [uid]
    )) as any

    const [totalRow] = (await con.execute(
      "SELECT Count(id) as total FROM practice_level",
      [uid]
    )) as any

    return responseJson(event, 200, "ok", {
      streak,
      levelCount: rows2.length,
      total: totalRow[0].total,
    })
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
