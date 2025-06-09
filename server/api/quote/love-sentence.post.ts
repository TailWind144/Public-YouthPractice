import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    id: Joi.any().required(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()

  try {
    const uid = event.context.uid
    const [rows] = (await con.execute(
      "SELECT * FROM quote_collect where user_id = ? and quote_id = ?",
      [uid, body.id]
    )) as any

    if (rows.length) {
      await con.execute(
        "DELETE FROM quote_collect where user_id = ? and quote_id = ?",
        [uid, body.id]
      )
      return responseJson(event, 200, "ok", {})
    }

    await con.execute(
      "INSERT INTO quote_collect(`user_id`, `quote_id`) VALUES (?, ?)",
      [uid, body.id]
    )
    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
