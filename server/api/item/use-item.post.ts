import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson, updateItemNums } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    name: Joi.string().required(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const uid = event.context.uid
    const [isHasRows] = (await con.execute(
      "SELECT * FROM shop where name = ?",
      [body.name]
    )) as any

    if (!isHasRows.length) return responseJson(event, 403, "不存在该物品", {})

    const [rows] = (await con.execute(
      "SELECT shop.id as itemId, nums FROM user_items, shop where user_id = ? and item_id = shop.id and name = ?",
      [uid, body.name]
    )) as any

    if (!rows.length)
      return responseJson(event, 403, `你的${body.name}不足，无法使用`, {})

    const targetNums = rows[0].nums - 1
    await updateItemNums(con, uid, rows[0].itemId, targetNums)

    if (body.name === "经验药水") {
      const [user] = (await con.execute(
        "Select points, experience FROM user_info where id = ?",
        [uid]
      )) as any
      const targetExperience = user[0].experience + 5
      const level = getTargetLevel(targetExperience)
      await con.execute(
        "UPDATE user_info set experience = ?, cur_level = ? where id = ?",
        [targetExperience, level, uid]
      )
    }

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
