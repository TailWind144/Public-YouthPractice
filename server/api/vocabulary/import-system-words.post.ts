import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { customInsertWords } from "./add-custom-word.post"
import { delCache, generateCacheKey } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    id: Joi.any().required(),
    wordIds: Joi.any().required(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const { id, wordIds } = body
    const uid = event.context.uid
    const [authRows] = (await con.execute(
      "SELECT * FROM vocabulary_book WHERE id = ? AND user_id = ?",
      [id, uid]
    )) as any
    if (!authRows.length) return responseJson(event, 403, "无权限", {})

    const placeholders = wordIds.map(() => "?").join(",")
    const baseSql = `
      SELECT word, book_meaning as bookMeaning, symbol, example
      FROM vocabulary_book_words 
      WHERE id in (${placeholders})`

    const [rows] = (await con.execute(baseSql, wordIds)) as any
    for (const row of rows) {
      await customInsertWords(con, uid, id, row)
    }

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
