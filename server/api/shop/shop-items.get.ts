import getDB from "@/server/db/mysql"
import { responseJson, groupByKey } from "@/server/utils/helper"
import { getCache, setCache } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const cacheKey = "shop:shop-items"
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回商店物品")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    const [rows] = (await con.execute(
      "SELECT id, kind, name, `desc`, point, img_url as imgUrl FROM shop"
    )) as any
    console.log("rows", rows)

    const data = groupByKey(rows, "kind")

    await setCache(cacheKey, data, 60 * 60 * 24)

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
