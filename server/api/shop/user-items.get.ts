import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const con = await getDB()
  try {
    const uid = event.context.uid
    const [rows] = (await con.execute(
      "SELECT kind, name, nums, `desc`, img_url as imgUrl FROM user_items, shop where item_id = shop.id and user_id = ? order by shop.id",
      [uid]
    )) as any
    console.log("rows", rows)

    const data = groupByKey(rows, "kind")

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
