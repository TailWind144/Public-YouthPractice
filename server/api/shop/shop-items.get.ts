import getDB from "@/server/db/mysql"
import { responseJson, groupByKey } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const con = await getDB()
  try {
    const [rows] = (await con.execute(
      "SELECT id, kind, name, `desc`, point, img_url as imgUrl FROM shop"
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
