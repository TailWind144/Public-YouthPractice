import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    id: Joi.any().required(),
    isMark: Joi.any().required(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const { id, isMark } = body
    const uid = event.context.uid
    const [authRows] = (await con.execute(
      "SELECT * FROM vocabulary_list WHERE id = ? AND user_id = ?",
      [id, uid]
    )) as any
    if (!authRows.length) return responseJson(event, 403, "无权限", {})

    const { proficiency } = authRows[0]
    if (proficiency === 100) return

    await con.execute("UPDATE vocabulary_list set status = ? where id = ?", [
      isMark === true ? 2 : 1,
      id,
    ])

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
