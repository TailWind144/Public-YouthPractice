import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { delCache, generateCacheKey } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    id: Joi.any().required(),
    word: Joi.any().required(),
    symbol: Joi.any().optional(),
    bookMeaning: Joi.any().required(),
    example: Joi.any().optional(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const uid = event.context.uid
    const { id, word, symbol, bookMeaning, example } = body
    const [authRows] = (await con.execute(
      "SELECT * FROM vocabulary_book WHERE id = ? AND user_id = ?",
      [id, uid]
    )) as any
    if (!authRows.length) return responseJson(event, 403, "无权限", {})

    await customInsertWords(con, uid, id, {
      word,
      symbol: symbol || null,
      bookMeaning,
      example: example || null,
    })

    await Promise.all([
      con.execute(
        "UPDATE vocabulary_book set update_time = NOW() where id = ? AND user_id = ?",
        [id, uid]
      ),
      delCache(generateCacheKey("vocabulary:record-list", { uid })),
      delCache(generateCacheKey("vocabulary:custom-list-info", { id })),
    ])

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})

export const customInsertWords = async (
  con: any,
  uid: any,
  id: any,
  { word, symbol, bookMeaning, example }
) => {
  const status = 1
  const [res] = (await con.execute(
    "INSERT INTO vocabulary_book_words(`book_id`, `word`, `symbol`, `book_meaning`, `example`) VALUES (?, ?, ?, ?, ?)",
    [id, word, symbol || null, bookMeaning, example || null]
  )) as any
  const wordId = res.insertId
  const [recordRows] = (await con.execute(
    "SELECT * FROM vocabulary_record WHERE book_id = ?",
    [id]
  )) as any
  if (recordRows.length) {
    let sql =
      "INSERT INTO vocabulary_list(`record_id`, `word_id`, `user_id`, `status`) VALUES "
    const params = []
    for (const record of recordRows) {
      sql += "(?, ?, ?, ?),"
      params.push(record.id, wordId, uid, status)
    }
    sql = sql.slice(0, -1)
    await con.execute(sql, params)
  }
}