import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { rewardScore } from "~/server/utils/const"

type Answers = {
  id: number
  unitId: number
  answers: string[]
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Answers>(event)
  console.log("body", body)

  const schema = Joi.object({
    id: Joi.any().required(),
    unitId: Joi.any().required(),
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
    const [rows] = (await con.execute(
      "SELECT answer, point, explanation FROM practice_questions where stem_id = ?",
      [body.id]
    )) as any
    let score = 0
    const s = Math.floor(100 / rows.length)
    let rightNums = 0
    rows.forEach((row: any, index: number) => {
      row.isCorrect = row.answer === body.answers[index]
      if (row.isCorrect) rightNums++
    })
    score = rightNums === rows.length ? 100 : rightNums * s

    const [isRewardRows] = (await con.execute(
      "SELECT is_reward as isReward FROM practice_user_level where user_id = ? and level_id = ? order by finish_time desc",
      [uid, body.id]
    )) as any

    const isBeforeReward = isRewardRows.length ? isRewardRows[0].isReward : 0
    let isReward = isBeforeReward
    if (!isBeforeReward && score >= rewardScore) {
      isReward = 1
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
      "INSERT INTO practice_user_level(`unit_id`, `user_id`, `level_id`, `level_status`, `score`, `is_reward`) VALUES (?, ?, ?, ?, ?, ?)",
      [body.unitId, uid, body.id, 1, score, isReward]
    )) as any
    const insertArr: any[] = []
    body.answers.forEach((item, index) => {
      insertArr.push(uid, res.insertId, index + 1, item, rows[index].isCorrect)
    })
    await con.execute(
      "INSERT INTO practice_user_questions(`user_id`, `user_level_id`, `index`, `answer`, `is_correct`) VALUES " +
        new Array(body.answers.length).fill("(?, ?, ?, ?, ?)").join(","),
      insertArr
    )

    return responseJson(event, 200, "ok", {
      score,
      isBeforeReward: Boolean(isBeforeReward),
      userLevelId: res.insertId,
      data: rows,
    })
  } catch (e: any) {
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
