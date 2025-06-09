import dayjs from "dayjs"
import getDB from "@/server/db/mysql"
import { responseJson, getTargetLevel } from "@/server/utils/helper"
import { checkinConst } from "@/server/utils/const"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const con = await getDB()

  try {
    const uid = event.context.uid
    const today = dayjs()
    const [rows] = (await con.execute(
      "SELECT * FROM user_checkins where user_id = ? and checkin_date = ?",
      [uid, today.format("YYYY-MM-DD")]
    )) as any

    if (rows.length) return responseJson(event, 403, "当天已签到", {})

    const [userRows] = (await con.execute(
      "SELECT points, experience, cur_level as level FROM user_info where id = ?",
      [uid]
    )) as any

    const yesterday = today.subtract(1, "day")
    const [rows2] = (await con.execute(
      "SELECT * FROM user_checkins where user_id = ? and checkin_date = ?",
      [uid, yesterday.format("YYYY-MM-DD")]
    )) as any
    const streak = 1 + (rows2.length ? rows2[0].streak : 0)
    await con.execute(
      "INSERT INTO user_checkins(`user_id`, `streak`) VALUES (?, ?)",
      [uid, streak]
    )

    const exp = userRows[0].experience
    const points = userRows[0].points
    const isSevenDay = streak % 7 === 0
    const isMonth = streak % 30 === 0
    const { dayPoint, dayExp, sevenPoint, sevenExp, monthPoint, monthExp } =
      checkinConst

    const plusExp =
      dayExp + (isSevenDay ? sevenExp : 0) + (isMonth ? monthExp : 0)
    const targetExp = exp + plusExp

    const plusPoint =
      dayPoint + (isSevenDay ? sevenPoint : 0) + (isMonth ? monthPoint : 0)
    const targetPoint = points + plusPoint

    const level = getTargetLevel(exp)

    await con.execute(
      "UPDATE user_info set points = ?, experience = ?, cur_level = ? where id = ?",
      [targetPoint, targetExp, level, uid]
    )

    return responseJson(event, 200, "ok", { plusPoint, plusExp })
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
