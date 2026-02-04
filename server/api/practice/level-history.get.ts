import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson, formatSmartDateTime } from "@/server/utils/helper"
import { rewardScore } from "~/server/utils/const"
// @ts-ignore

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const schema = Joi.object({
    uid: Joi.any().required(),
    unitId: Joi.any().required(),
  })
  try {
    await schema.validateAsync(query)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    let [rows] = (await con.execute(
      "SELECT title, score, finish_time as finishTime, is_reward as isReward FROM practice_user_level, practice_level where practice_user_level.level_id = practice_level.id and user_id = ? and practice_user_level.unit_id = ? order by finish_time desc",
      [query.uid, query.unitId]
    )) as any

    for (const row of rows) {
      row.isSuccess = row.score >= rewardScore
      row.finishTime = formatSmartDateTime(row.finishTime)
    }

    return responseJson(event, 200, "ok", rows)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
