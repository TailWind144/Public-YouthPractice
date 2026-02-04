import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import dayjs from "dayjs"
import Joi from "joi"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log("query", query)

  const schema = Joi.object({
    total: Joi.any().optional(),
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
      `SELECT COUNT(*) AS total FROM dictation_task WHERE user_id = ?`,
      [uid]
    )) as any

    const [rows] = (await con.execute(
      `SELECT 
         dt.id,
         dt.title,
         dt.time,
         dt.max_play_count as maxPlayCount,
         dt.create_time as createTime,
         dt.grade,
         COUNT(dtw.id) as total
       FROM dictation_task dt
       LEFT JOIN dictation_task_words dtw ON dt.id = dtw.task_id
       WHERE user_id = ?
       GROUP BY dt.id, dt.title, dt.time, dt.max_play_count, dt.create_time
       ORDER BY dt.create_time DESC
       LIMIT ? OFFSET ?`,
      [uid, String(pageSize), String(offset)]
    )) as any

    for (const row of rows)
      row.createTime = dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss")

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
