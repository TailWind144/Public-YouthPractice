import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log("query", query)

  const schema = Joi.object({
    name: Joi.string().required(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const uid = event.context.uid
    const [isHasRows] = (await con.execute(
      "SELECT * FROM shop where name = ?",
      [query.name]
    )) as any

    if (!isHasRows.length) return responseJson(event, 403, "不存在该物品", {})

    const [rows] = (await con.execute(
      "SELECT nums FROM user_items, shop where user_id = ? and item_id = shop.id and name = ?",
      [uid, query.name]
    )) as any
    console.log("rows", rows)

    if (!rows.length) rows[0] = { nums: 0 }

    return responseJson(event, 200, "ok", rows[0])
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
