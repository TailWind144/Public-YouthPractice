import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { delCache, generateCacheKey } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    id: Joi.any().required(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const { id } = body
    const uid = event.context.uid

    const [authRows] = (await con.execute(
      "SELECT * FROM vocabulary_book WHERE id = ? AND user_id = ?",
      [id, uid]
    )) as any
    if (!authRows.length) return responseJson(event, 403, "无权限", {})

    const [rows] = (await con.execute(
      "SELECT * FROM vocabulary_record WHERE book_id = ?",
      [id]
    )) as any
    let recordId
    if (rows.length) recordId = rows[0].id

    await Promise.all([
      con.execute("DELETE FROM vocabulary_book WHERE id = ?", [id]),
      con.execute("DELETE FROM vocabulary_record WHERE book_id = ?", [id]),
      con.execute("DELETE FROM vocabulary_book_words WHERE book_id = ?", [id]),
      delCache(generateCacheKey("vocabulary:custom-list", { uid })),
      delCache(generateCacheKey("vocabulary:record-list", { uid })),
      recordId
        ? con.execute("DELETE FROM vocabulary_list WHERE record_id = ?", [
            recordId,
          ])
        : null,
    ])

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
