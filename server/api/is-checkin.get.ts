import dayjs from "dayjs"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const con = await getDB()
  try {
    const uid = event.context.uid
    const today = dayjs()
    const [rows] = (await con.execute(
      "SELECT * FROM user_checkins where user_id = ? and checkin_date = ?",
      [uid, today.format("YYYY-MM-DD")]
    )) as any

    return responseJson(event, 200, "ok", {
      isCheckin: rows.length ? true : false,
    })
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
