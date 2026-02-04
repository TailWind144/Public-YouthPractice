import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import dayjs from "dayjs"
import Joi from "joi"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log("query", query)

  const schema = Joi.object({
    grade: Joi.any().required(),
    teacherId: Joi.any().required(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const uid = event.context.uid
    const { grade, teacherId } = query

    const [rows] = (await con.execute(
      `SELECT 
        dt.id as id, 
        title, 
        time, 
        max_play_count as maxPlayCount, 
        create_time as createTime,
        COUNT(DISTINCT dtw.id) as total
      FROM dictation_task dt
      LEFT JOIN dictation_user_record dur ON dt.id = dur.task_id AND dur.user_id = ?
      LEFT JOIN dictation_task_words dtw ON dt.id = dtw.task_id
      WHERE dur.id IS NULL and dt.grade = ? and dt.user_id = ?
      GROUP BY dt.id, dt.title, dt.time, dt.max_play_count, dt.create_time`,
      [uid, grade, teacherId]
    )) as any

    for (const row of rows)
      row.createTime = dayjs(row.createTime).format("YYYY-MM-DD")

    return responseJson(event, 200, "ok", rows)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
