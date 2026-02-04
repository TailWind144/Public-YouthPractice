import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { delCache, generateCacheKey } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    title: Joi.any().required(),
    remark: Joi.any().optional(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const uid = event.context.uid

    await Promise.all([
      con.execute(
        "INSERT INTO vocabulary_book(`user_id`, `title`, `remark`) VALUES (?, ?, ?)",
        [uid, body.title, body.remark]
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
