import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
// @ts-ignore

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const schema = Joi.object({
    id: Joi.any().required(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    let [rows] = (await con.execute(
      "SELECT pu.id, pu.name, IFNULL(pl.count_id, 0) AS count FROM  practice_unit pu LEFT JOIN (SELECT unit_id, COUNT(id) AS count_id FROM practice_level WHERE module_id = ? GROUP BY unit_id) pl ON pu.id = pl.unit_id WHERE pu.module_id = ?",
      [query.id, query.id]
    )) as any
    const data = rows

    const uid = event.context.uid
    if (uid) {
      ;[rows] = (await con.execute(
        "SELECT pu.id AS unit_id, COUNT(DISTINCT pul.level_id) AS passed_count FROM practice_unit pu LEFT JOIN practice_user_level pul ON pu.id = pul.unit_id AND pul.user_id = ? WHERE pu.module_id = ? GROUP BY pu.id",
        [uid, query.id]
      )) as any
      data.forEach((item: any, index: number) => {
        item.passedCount = rows[index].passed_count
      })
    }

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
