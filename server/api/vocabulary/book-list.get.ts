import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import Joi from "joi"
import { generateCacheKey, getCache, setCache } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log("query", query)

  const schema = Joi.object({
    type: Joi.any().optional(),
    page: Joi.any().optional(),
    pageSize: Joi.any().optional(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const cacheKey = generateCacheKey("vocabulary:book-list", query)
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回词库列表")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    const { type } = query

    const page = Number(query.page as string) || 1
    const pageSize = Number(query.pageSize as string) || 10
    const offset = (page - 1) * pageSize

    // 构建基础 SQL 和参数
    let baseWhereClause = "WHERE is_system = 1"
    const baseQueryParams: any[] = []

    let countWhereClause = "WHERE is_system = 1"
    const countQueryParams: any[] = []

    // 处理 type 参数
    if (type && type !== "0") {
      baseWhereClause += " AND class = ?"
      baseQueryParams.push(type)

      countWhereClause += " AND class = ?"
      countQueryParams.push(type)
    }

    // 查询总数
    const [totalRows] = (await con.execute(
      `SELECT COUNT(*) AS total FROM vocabulary_book ${countWhereClause}`,
      countQueryParams
    )) as any

    // 查询分页数据
    const [rows] = (await con.execute(
      `SELECT vocabulary_book.id AS id, title, cover, COUNT(*) AS total 
       FROM vocabulary_book 
       JOIN vocabulary_book_words ON vocabulary_book.id = vocabulary_book_words.book_id 
       ${baseWhereClause} 
       GROUP BY vocabulary_book.id 
       LIMIT ? OFFSET ?`,
      [...baseQueryParams, String(pageSize), String(offset)]
    )) as any

    const data = {
      total: totalRows[0].total,
      data: rows,
    }

    await setCache(cacheKey, data, 7200)

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
