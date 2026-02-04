import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import Joi from "joi"
import { generateCacheKey, getCache, setCache } from "~/utils/cache"

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

  const uid = event.context.uid
  const cacheKey = generateCacheKey("dictation:detail", { uid, ...query })
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回听写练习答案信息")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    const { id } = query

    const [recordRows] = (await con.execute(
      "SELECT * FROM dictation_user_record where user_id = ? and task_id = ?",
      [uid, id]
    )) as any
    if (!recordRows.length) return responseJson(event, 200, "无练习记录", false)
    const { id: recordId } = recordRows[0]

    let [rows] = (await con.execute(
      "SELECT word FROM dictation_task_words where task_id = ?",
      [id]
    )) as any
    const checkAnswersArr = rows

    ;[rows] = (await con.execute(
      "SELECT answer, is_correct FROM dictation_user_record_answer where record_id = ?",
      [recordId]
    )) as any
    const answers = new Array(rows.length).fill(null)
    rows.forEach((row: any, index: number) => {
      checkAnswersArr[index].isCorrect = row.is_correct
      answers[index] = row.answer
    })

    const data = { checkAnswersArr, answers, score: recordRows[0].score }
    await setCache(cacheKey, data, 7200)

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
