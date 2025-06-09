import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import dayjs from "dayjs"
import { quoteTimeFormat } from "~/server/utils/const"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const con = await getDB()
  try {
    const uid = event.context.uid
    let rows = null
    if (query.id) {
      ;[rows] = (await con.execute(
        "SELECT id, en, cn, origin_en as originEn, origin_cn as originCn, publish_time as publishTime, link FROM quote_info WHERE id = ?",
        [query.id]
      )) as any
    } else
      [rows] = (await con.execute(
        "SELECT id, en, cn, origin_en as originEn, origin_cn as originCn, publish_time as publishTime, link FROM quote_info WHERE publish_time = CURDATE()"
      )) as any

    const [isLoveRows] = (await con.execute(
      "SELECT * FROM quote_collect WHERE user_id = ? and quote_id = ?",
      [uid, rows[0].id]
    )) as any

    rows[0].isLove = isLoveRows.length !== 0
    rows[0].publishTime = dayjs(rows[0].publishTime).format(quoteTimeFormat)

    return responseJson(event, 200, "ok", rows[0])
  } catch (e: any) {
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
