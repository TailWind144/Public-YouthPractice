import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { delCache, generateCacheKey } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    id: Joi.any().required(),
    title: Joi.any().required(),
    remark: Joi.any().required(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const uid = event.context.uid

    await con.execute(
      "UPDATE vocabulary_book set title = ?, remark = ?, update_time = NOW() where id = ? AND user_id = ?",
      [body.title, body.remark, body.id, uid]
    )

    await Promise.all([
      delCache(
        generateCacheKey("vocabulary:custom-list-info", { id: body.id })
      ),
      delCache(generateCacheKey("vocabulary:custom-list", { uid })),
    ])

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
