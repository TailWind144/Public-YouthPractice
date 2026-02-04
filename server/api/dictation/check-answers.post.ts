import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { rewardScore } from "~/server/utils/const"
import { delCache, generateCacheKey } from "~/utils/cache"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    id: Joi.any().required(),
    answers: Joi.any().required(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()

  try {
    const uid = event.context.uid
    const [recordRows] = (await con.execute(
      "SELECT * FROM dictation_user_record where user_id = ? and task_id = ?",
      [uid, body.id]
    )) as any
    if (recordRows.length)
      return responseJson(event, 200, "该任务已有练习记录", {})

    const [rows] = (await con.execute(
      "SELECT word FROM dictation_task_words where task_id = ?",
      [body.id]
    )) as any
    let score = 0
    const s = Math.floor(100 / rows.length)
    let rightNums = 0
    rows.forEach((row: any, index: number) => {
      row.isCorrect =
        row.word.toLowerCase() === body.answers[index].toLowerCase()
      if (row.isCorrect) rightNums++
    })
    score = rightNums === rows.length ? 100 : rightNums * s

    if (score >= rewardScore) {
      const [user] = (await con.execute(
        "Select points, experience FROM user_info where id = ?",
        [uid]
      )) as any
      const targetPoints = user[0].points + 1
      const targetExperience = user[0].experience + 5
      const level = getTargetLevel(targetExperience)
      await con.execute(
        "UPDATE user_info set points = ?, experience = ?, cur_level = ? where id = ?",
        [targetPoints, targetExperience, level, uid]
      )
    }

    const [res] = (await con.execute(
      "INSERT INTO dictation_user_record(`user_id`, `task_id`, `score`) VALUES (?, ?, ?)",
      [uid, body.id, score]
    )) as any
    const insertArr: any[] = []
    body.answers.forEach((item, index) => {
      insertArr.push(res.insertId, index + 1, item, rows[index].isCorrect)
    })
    await con.execute(
      "INSERT INTO dictation_user_record_answer(`record_id`, `index`, `answer`, `is_correct`) VALUES " +
        new Array(body.answers.length).fill("(?, ?, ?, ?)").join(","),
      insertArr
    )

    await delCache(generateCacheKey("dictation:detail", { id: body.id }))

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
