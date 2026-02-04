import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { delCache, generateCacheKey } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    bookId: Joi.any().required(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const uid = event.context.uid

    const [isExistRows] = (await con.execute(
      "SELECT * FROM vocabulary_record WHERE book_id = ? AND user_id = ?",
      [body.bookId, uid]
    )) as any
    if (isExistRows.length)
      return responseJson(
        event,
        400,
        "你的记录中已存在该词库，请在记录中切换词库开始学习",
        {}
      )

    const [wordsRows] = (await con.execute(
      "SELECT * FROM vocabulary_book_words WHERE book_id = ?",
      [body.bookId]
    )) as any
    if (!wordsRows.length)
      return responseJson(event, 400, "至少要有一个单词才能开始", {})

    const [isSystemRows] = (await con.execute(
      "SELECT * FROM vocabulary_book WHERE id = ?",
      [body.bookId]
    )) as any
    const isSystem = isSystemRows[0].is_system

    const [res] = (await con.execute(
      "INSERT INTO vocabulary_record(`user_id`, `book_id`) VALUES (?, ?)",
      [uid, body.bookId]
    )) as any
    const recordId = res.insertId

    let sql =
      "INSERT INTO vocabulary_list(`record_id`, `word_id`, `user_id`, `status`, `is_system`) VALUES "
    const params = []
    const status = isSystem == 1 ? 0 : 1
    for (const row of wordsRows) {
      sql += "(?, ?, ?, ?, ?),"
      params.push(recordId, row.id, uid, status, isSystem)
    }
    sql = sql.slice(0, -1)
    await con.execute(sql, params)

    await delCache(generateCacheKey("vocabulary:record-list", { uid }))

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
