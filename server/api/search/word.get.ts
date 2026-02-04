import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import Joi from "joi"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log("query", query)

  const schema = Joi.object({
    search: Joi.string().min(1).max(100).required(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const MAX_NUMS = 50
    const uid = event.context.uid
    const searchTerm = `%${query.search}%`

    // 查询单词数据，限制结果数量避免性能问题
    const [rows] = (await con.execute(
      `SELECT 
        vbw.id,
        vbw.word, 
        vbw.symbol, 
        vbw.book_meaning,
        vbw.example,
        vb.title as book_title,
        vb.class
      FROM vocabulary_book_words vbw
      LEFT JOIN vocabulary_book vb ON vbw.book_id = vb.id
      WHERE (vb.user_id = ? OR vb.is_system = 1)
        AND vbw.word LIKE ?
      LIMIT ${MAX_NUMS}`, // 限制最大结果数，避免性能问题
      [uid, searchTerm]
    )) as any

    console.log("查询到单词数量:", rows.length)

    // 按课本分组整理数据
    const groupedData = rows.reduce((acc, item) => {
      const classMap = {
        1: "小学",
        2: "初中",
        3: "高中",
        4: "其他",
      }

      const classText = classMap[item.class] || "其他"

      // 构建分组标题
      const title = item.book_title || `${classText}词汇`

      // 查找或创建分组
      let group = acc.find((g) => g.title === title)
      if (!group) {
        group = {
          title: title,
          class: classText,
          list: [],
        }
        acc.push(group)
      }

      // 添加单词到分组
      group.list.push({
        id: item.id,
        word: item.word,
        symbol: item.symbol,
        bookMeaning: item.book_meaning,
        bookTitle: item.book_title,
        class: classText,
        example: item.example,
      })

      return acc
    }, [])

    // 构建响应数据
    const responseData = {
      totalWords: rows.length,
      totalGroups: groupedData.length,
      groups: groupedData,
      searchInfo: {
        term: query.search,
        hasMore: rows.length >= MAX_NUMS, // 如果达到限制数，提示可能有更多结果
      },
    }

    return responseJson(event, 200, "搜索成功", responseData)
  } catch (e: any) {
    console.log("搜索错误:", e)
    return responseJson(event, 500, "搜索失败", {})
  } finally {
    con.release()
  }
})
