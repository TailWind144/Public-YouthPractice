import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { getCache, setCache } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const cacheKey = "practice:module"
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回练习模块列表")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    let [rows] = (await con.execute(
      "SELECT pm.*, IFNULL(pl.count_id, 0) AS count FROM practice_module pm LEFT JOIN (SELECT module_id, COUNT(id) AS count_id FROM practice_level GROUP BY module_id) pl ON pm.id = pl.module_id"
    )) as any

    await setCache(cacheKey, rows, 60 * 60 * 6)

    return responseJson(event, 200, "ok", rows)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
