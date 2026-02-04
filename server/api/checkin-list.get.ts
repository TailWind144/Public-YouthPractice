import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log("query", query)

  const schema = Joi.object({
    date: Joi.any().required(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const uid = event.context.uid
    const [rows] = (await con.execute(
      "SELECT checkin_date as checkinDate FROM user_checkins where user_id = ? and checkin_date like ?",
      [uid, query.date]
    )) as any

    return responseJson(event, 200, "ok", rows)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
