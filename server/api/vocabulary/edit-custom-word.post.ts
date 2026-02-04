import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import dayjs from "dayjs"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    listId: Joi.any().required(),
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
    const { listId, id, word, symbol, bookMeaning, example } = body
    const [authRows] = (await con.execute(
      "SELECT * FROM vocabulary_book WHERE id = ? AND user_id = ?",
      [listId, uid]
    )) as any
    if (!authRows.length) return responseJson(event, 403, "无权限", {})

    await con.execute(
      "UPDATE vocabulary_book_words set book_meaning = ?, symbol = ?, example = ?, update_time = NOW() where id = ?",
      [bookMeaning, symbol || null, example || null, id]
    )

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})