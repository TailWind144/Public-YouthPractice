import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const schema = Joi.object({
    exerciseId: Joi.any().required(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const uid = event.context.uid
    let [rows] = (await con.execute(
      "SELECT answer FROM media_exercises where chapter_id = ?",
      [query.exerciseId]
    )) as any
    const checkAnswersArr = rows

    ;[rows] = (await con.execute(
      "SELECT answer, is_correct FROM media_user_exercises where user_id = ? and exercise_id = ?",
      [uid, query.exerciseId]
    )) as any
    if (rows.length) {
      const answers = new Array(rows.length).fill(null)
      rows.forEach((row: any, index: number) => {
        checkAnswersArr[index].isCorrect = row.is_correct
        answers[index] = row.answer
      })
      return responseJson(event, 200, "ok", { checkAnswersArr, answers })
    }

    return responseJson(event, 200, "ok", null)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
