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
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const [rows] = (await con.execute(
      `SELECT 
        vbw.unit, 
        vbw.section, 
        COUNT(vbw.id) as total,
        SUM(CASE WHEN vl.last_review_time IS NOT NULL THEN 1 ELSE 0 END) as learned_count,
        vbu.title as unit_title,
        vbs.title as section_title
      FROM vocabulary_book_words vbw 
      INNER JOIN vocabulary_list vl ON vbw.id = vl.word_id 
      LEFT JOIN vocabulary_book_unit vbu ON vbw.unit = vbu.id
      LEFT JOIN vocabulary_book_section vbs ON vbw.section = vbs.id
      WHERE vl.record_id = ? 
      GROUP BY vbw.unit, vbw.section, vbu.title, vbs.title`,
      [query.id]
    )) as any

    const data: Record<string, any> = {}

    const unitStats: Record<string, { total: number; learned: number }> = {}
    for (const row of rows) {
      row.learned_count = Number(row.learned_count)
      const key = String(row.unit)
      const obj = {
        key: row.section,
        name: row.section_title,
        total: row.total,
        learned: row.learned_count,
        isFinish: row.total === row.learned_count,
      }

      if (!unitStats[key]) {
        unitStats[key] = { total: 0, learned: 0 }
      }
      unitStats[key].total += row.total
      unitStats[key].learned += row.learned_count

      if (data[key]) {
        data[key].sections.push(obj)
      } else {
        data[key] = {
          sections: [obj],
          title: row.unit_title,
        }
      }
    }

    for (const unit of Object.keys(data)) {
      const stats = unitStats[unit]
      data[unit].percent = (stats.learned / stats.total).toFixed(2)
    }

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
