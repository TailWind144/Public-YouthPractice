import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import Joi from "joi"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log("query", query)

  const schema = Joi.object({
    page: Joi.any().optional(),
    pageSize: Joi.any().optional(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const uid = event.context.uid
    const page = Number(query.page as string) || 1
    const pageSize = Number(query.pageSize as string) || 10
    const offset = (page - 1) * pageSize

    const [totalRows] = (await con.execute(
      `SELECT COUNT(*) AS total FROM dictation_user_record WHERE user_id = ?`,
      [uid]
    )) as any

    const [rows] = (await con.execute(
      "SELECT dur.*, title FROM dictation_user_record as dur, dictation_task as dt WHERE dur.task_id = dt.id and dur.user_id = ? order by finish_time desc LIMIT ? OFFSET ?",
      [uid, String(pageSize), String(offset)]
    )) as any
    for (const row of rows) {
      row.isSuccess = row.score >= rewardScore
      row.finishTime = formatSmartDateTime(row.finish_time)
    }

    const data = {
      total: totalRows[0].total,
      data: rows,
    }

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
