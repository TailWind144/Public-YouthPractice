import Joi from "joi"
import dayjs from "dayjs"
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

    await con.execute(
      "UPDATE vocabulary_record set update_time = NOW() where id = ?",
      [id]
    )

    const uid = event.context.uid
    await delCache(generateCacheKey("vocabulary:record-list", { uid }))

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
