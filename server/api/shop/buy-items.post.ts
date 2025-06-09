import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    id: Joi.any().required(),
    nums: Joi.number().required(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const uid = event.context.uid
    const [userRows] = (await con.execute(
      "Select points FROM user_info where id = ?",
      [uid]
    )) as any

    const [itemRows] = (await con.execute(
      "SELECT point FROM shop where id = ?",
      [body.id]
    )) as any

    const sumPoints = itemRows[0].point * body.nums
    const userPoints = userRows[0].points
    if (sumPoints > userPoints)
      return responseJson(event, 403, "你的积分不足，无法兑换", {})

    const targetPoints = userPoints - sumPoints
    await con.execute("UPDATE user_info set points = ? where id = ?", [
      targetPoints,
      uid,
    ])
    const [rows] = (await con.execute(
      "SELECT id,nums FROM user_items where user_id = ? and item_id = ?",
      [uid, body.id]
    )) as any
    if (rows.length) {
      const userNums = rows[0].nums
      const targetNums = userNums + body.nums
      await con.execute(
        "UPDATE user_items set nums = ? where user_id = ? and item_id = ?",
        [targetNums, uid, body.id]
      )
    } else
      await con.execute(
        "INSERT INTO user_items(`user_id`, `item_id`, `nums`) VALUES (?, ?, ?)",
        [uid, body.id, body.nums]
      )

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
