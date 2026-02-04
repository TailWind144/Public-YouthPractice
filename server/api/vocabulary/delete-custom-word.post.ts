import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { delCache, generateCacheKey } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    listId: Joi.any().required(),
    id: Joi.any().required(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const { listId, id } = body
    const uid = event.context.uid

    const [authRows] = (await con.execute(
      "SELECT * FROM vocabulary_book WHERE id = ? AND user_id = ?",
      [listId, uid]
    )) as any
    if (!authRows.length) return responseJson(event, 403, "无权限", {})

    await Promise.all([
      con.execute("DELETE FROM vocabulary_book_words WHERE id = ?", [id]),
      con.execute("DELETE FROM vocabulary_list WHERE word_id = ?", [id]),
    ])

    await Promise.all([
      con.execute(
        "UPDATE vocabulary_book set update_time = NOW() where id = ? AND user_id = ?",
        [listId, uid]
      ),
      delCache(generateCacheKey("vocabulary:record-list", { uid })),
      delCache(generateCacheKey("vocabulary:custom-list-info", { id: listId })),
    ])

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
