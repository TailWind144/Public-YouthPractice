import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import dayjs from "dayjs"
// @ts-ignore

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const schema = Joi.object({
    uid: Joi.any().required(),
    levelId: Joi.any().required(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    let [rows] = (await con.execute(
      "SELECT id, level_status as status, score, finish_time as finishTime FROM practice_user_level where user_id = ? and level_id = ? order by finish_time desc",
      [query.uid, query.levelId]
    )) as any

    for (const row of rows) {
      row.status = "完成"
      row.finishTime = dayjs(row.finishTime).format("YYYY-MM-DD HH:mm")
    }

    return responseJson(event, 200, "ok", rows)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
