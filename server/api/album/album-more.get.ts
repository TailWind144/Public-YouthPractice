import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log("query", query)

  const schema = Joi.object({
    id: Joi.any().required(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    console.error("参数验证失败:", e)
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const [rows] = (await con.execute(
      "SELECT * FROM media_library where type = 2 and id != ? ORDER BY RAND() LIMIT 10",
      [query.id]
    )) as any

    return responseJson(event, 200, "ok", rows)
  } catch (e: any) {
    console.error("服务器错误:", e)
    return responseJson(event, 500, e.message || "服务器内部错误", {})
  } finally {
    con.release()
  }
})
