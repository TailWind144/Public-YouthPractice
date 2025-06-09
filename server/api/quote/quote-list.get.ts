import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import dayjs from "dayjs"
import { quoteTimeFormat } from "~/server/utils/const"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const con = await getDB()
  try {
    const uid = event.context.uid
    const page = Number(query.current as string) || 1
    const pageSize = Number(query.pageSize as string) || 5
    const offset = (page - 1) * pageSize

    const [totalRows] = (await con.execute(
      "SELECT COUNT(*) as total FROM quote_info WHERE publish_time <= CURDATE()"
    )) as any
    const total = totalRows[0].total

    const [rows] = (await con.execute(
      `SELECT 
          qi.id, 
          qi.en, 
          qi.cn, 
          qi.origin_en AS originEn, 
          qi.origin_cn AS originCn, 
          qi.publish_time AS publishTime, 
          qi.link,
          qc.quote_id AS isLove  
      FROM quote_info qi 
      LEFT JOIN quote_collect qc
          ON qi.id = qc.quote_id 
          AND qc.user_id = ?
      WHERE 
          qi.publish_time <= CURDATE()
      ORDER BY qi.publish_time DESC 
      LIMIT ? OFFSET ?;`,
      [uid, String(pageSize), String(offset)]
    )) as any

    for (const row of rows) {
      row.publishTime = dayjs(row.publishTime).format(quoteTimeFormat)
      row.isLove = row.isLove !== null
    }

    return responseJson(event, 200, "ok", {
      pagination: {
        total,
        page,
        pageSize,
      },
      data: rows,
    })
  } catch (e: any) {
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
