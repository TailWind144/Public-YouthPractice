import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import dayjs from "dayjs"
import Joi from "joi"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log("query", query)

  const schema = Joi.object({
    id: Joi.any().required(),
    page: Joi.any().optional(),
    pageSize: Joi.any().optional(),
    total: Joi.any().optional(),
    search: Joi.any().optional(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const uid = event.context.uid
    const [authRows] = (await con.execute(
      "SELECT * FROM vocabulary_book WHERE id = ? AND user_id = ?",
      [query.id, uid]
    )) as any
    if (!authRows.length) return responseJson(event, 403, "无权限", {})

    const page = Number(query.page as string) || 1
    const pageSize = Number(query.pageSize as string) || 10
    const offset = (page - 1) * pageSize

    let total
    const { search } = query
    let sql, params
    const searchPattern = `%${search}%`
    if (search) {
      sql =
        "SELECT id, word, book_meaning as bookMeaning, symbol, example, create_time as createTime, update_time as updateTime FROM vocabulary_book_words WHERE book_id = ? AND (word LIKE ? OR book_meaning LIKE ? OR symbol LIKE ?) ORDER BY createTime DESC LIMIT ? OFFSET ?"
      params = [
        query.id,
        searchPattern,
        searchPattern,
        searchPattern,
        String(pageSize),
        String(offset),
      ]

      const [totalRows] = (await con.execute(
        "SELECT COUNT(*) as total FROM vocabulary_book_words WHERE book_id = ? AND (word LIKE ? OR book_meaning LIKE ? OR symbol LIKE ?)",
        [query.id, searchPattern, searchPattern, searchPattern]
      )) as any
      total = totalRows[0].total
    } else {
      sql =
        "SELECT id, word, book_meaning as bookMeaning, symbol, example, create_time as createTime, update_time as updateTime FROM vocabulary_book_words WHERE book_id = ? LIMIT ? OFFSET ?"
      params = [query.id, String(pageSize), String(offset)]

      const [totalRows] = (await con.execute(
        "SELECT COUNT(*) as total FROM vocabulary_book_words WHERE book_id = ?",
        [query.id]
      )) as any
      total = totalRows[0].total
    }
    const [rows] = (await con.execute(sql, params)) as any

    for (const row of rows) {
      row.createTime = dayjs(row.createTime).format("YYYY-MM-DD")
      row.updateTime = dayjs(row.updateTime).format("YYYY-MM-DD")
    }

    const rtnData = {
      pagination: {
        total,
        page,
        pageSize,
      },
      data: rows,
    }

    return responseJson(event, 200, "ok", rtnData)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
