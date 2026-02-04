import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    title: Joi.any().required(),
    time: Joi.any().required(),
    maxPlayCount: Joi.any().required(),
    grade: Joi.any().required(),
    selectedWords: Joi.any().required(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const { title, time, maxPlayCount, selectedWords, grade } = body
    const uid = event.context.uid
    const [authRows] = (await con.execute(
      "SELECT * FROM user_info WHERE id = ? and role = 2",
      [uid]
    )) as any
    if (!authRows.length) return responseJson(event, 403, "无权限", {})

    const [res] = (await con.execute(
      "INSERT INTO dictation_task(`title`, `time`, `max_play_count`, `user_id`, `grade`) VALUES (?, ?, ?, ?, ?)",
      [title, time, maxPlayCount, uid, grade]
    )) as any
    const taskId = res.insertId

    const placeholders = selectedWords.map(() => "?").join(",")
    const baseSql = `
      SELECT word
      FROM vocabulary_book_words 
      WHERE id in (${placeholders})`

    const [rows] = (await con.execute(baseSql, selectedWords)) as any
    let sql =
      "INSERT INTO dictation_task_words(`task_id`, `word`, `index`) VALUES "
    const params: any[] = []
    rows.forEach((row: any, index: number) => {
      sql += "(?, ?, ?),"
      params.push(taskId, row.word, index + 1)
    })
    sql = sql.slice(0, -1)
    await con.execute(sql, params)

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
