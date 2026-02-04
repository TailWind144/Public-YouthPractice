import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import Joi from "joi"
import { generateCacheKey, getCache, setCache } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const schema = Joi.object({
    bookId: Joi.any().required(),
    unit: Joi.any().optional(),
    section: Joi.any().optional(),
    current: Joi.any().optional(),
    page: Joi.any().optional(),
    pageSize: Joi.any().optional(),
    total: Joi.any().optional(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const cacheKey = generateCacheKey("vocabulary:system-word-list", query)
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回系统单词列表")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    const page = Number(query.page as string) || 1
    const pageSize = Number(query.pageSize as string) || 10
    const offset = (page - 1) * pageSize

    const { bookId, unit, section } = query
    const baseSql = `
      SELECT vbw.id as id, title, word, unit, book_meaning as bookMeaning, symbol, example
      FROM vocabulary_book_words as vbw, vocabulary_book as vb
      WHERE book_id = ? AND book_id = vb.id`
    const totalSql = `
      SELECT COUNT(*) as total 
      FROM vocabulary_book_words 
      WHERE book_id = ?`
    const sufix = " LIMIT ? OFFSET ?"

    const conditions: string[] = []
    const params: any[] = [bookId]
    if (unit) {
      conditions.push("unit = ?")
      params.push(unit)
    }
    if (section) {
      conditions.push("section = ?")
      params.push(section)
    }

    const whereClause =
      conditions.length > 0 ? ` AND ${conditions.join(" AND ")}` : ""

    const [totalRows] = (await con.execute(
      totalSql + whereClause,
      params
    )) as any
    const total = totalRows[0].total

    const [rows] = (await con.execute(baseSql + whereClause + sufix, [
      ...params,
      String(pageSize),
      String(offset),
    ])) as any

    const rtnData = {
      pagination: {
        total,
        page,
        pageSize,
      },
      data: rows,
    }
    await setCache(cacheKey, rtnData)

    return responseJson(event, 200, "ok", rtnData)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
