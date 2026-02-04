import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { generateCacheKey, getCache, setCache } from "~/utils/cache"
// @ts-ignore

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const schema = Joi.object({
    levelId: Joi.any().required(),
    userLevelId: Joi.any().required(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const cacheKey = generateCacheKey("questions:detail", query)
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回用户练习答案信息")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    let [rows] = (await con.execute(
      "SELECT answer, point, explanation FROM practice_questions where stem_id = ?",
      [query.levelId]
    )) as any
    const checkAnswersArr = rows

    ;[rows] = (await con.execute(
      "SELECT answer, is_correct FROM practice_user_questions uq, practice_user_level ul where user_level_id = ul.id and level_id = ? and user_level_id = ?",
      [query.levelId, query.userLevelId]
    )) as any
    const answers = new Array(rows.length).fill(null)
    rows.forEach((row: any, index: number) => {
      checkAnswersArr[index].isCorrect = row.is_correct
      answers[index] = row.answer
    })

    const data = { checkAnswersArr, answers }
    await setCache(cacheKey, data, 7200)

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
