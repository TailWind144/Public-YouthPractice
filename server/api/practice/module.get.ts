import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
// @ts-ignore

export default defineEventHandler(async (event) => {
  const con = await getDB()
  try {
    let [rows] = (await con.execute(
      "SELECT pm.*, IFNULL(pl.count_id, 0) AS count FROM practice_module pm LEFT JOIN (SELECT module_id, COUNT(id) AS count_id FROM practice_level GROUP BY module_id) pl ON pm.id = pl.module_id"
    )) as any

    return responseJson(event, 200, "ok", rows)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
