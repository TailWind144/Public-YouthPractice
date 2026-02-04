import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    id: Joi.any().required(),
    grade: Joi.any().required(),
    time: Joi.any().required(),
    maxPlayCount: Joi.any().required(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const { id, time, maxPlayCount, grade } = body
    const uid = event.context.uid
    const [authRows] = (await con.execute(
      "SELECT * FROM user_info WHERE id = ? and role = 2",
      [uid]
    )) as any
    if (!authRows.length) return responseJson(event, 403, "无权限", {})

    await con.execute(
      "UPDATE dictation_task set time = ?, max_play_count = ?, grade = ? where id = ?",
      [time, maxPlayCount, grade, id]
    )

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
