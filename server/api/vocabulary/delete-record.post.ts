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

    await Promise.all([
      con.execute(
        "DELETE FROM vocabulary_record WHERE id = ? AND user_id = ?",
        [id, uid]
      ),
      con.execute(
        "DELETE FROM vocabulary_list WHERE record_id = ? AND user_id = ?",
        [id, uid]
      ),
      delCache(generateCacheKey("vocabulary:record-list", { uid })),
    ])

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
