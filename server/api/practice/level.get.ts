import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
// @ts-ignore

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const schema = Joi.object({
    id: Joi.any().required(),
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
      "SELECT stem_id as id, title FROM practice_level where unit_id = ?",
      [query.id]
    )) as any
    let [finishLevels] = (await con.execute(
      "SELECT distinct(level_id) as levelId FROM practice_user_level where user_id = ? and unit_id = ?",
      [uid, query.id]
    )) as any
    let [rewardLevels] = (await con.execute(
      "SELECT distinct(level_id) as levelId FROM practice_user_level where user_id = ? and unit_id = ? and is_reward = 1",
      [uid, query.id]
    )) as any
    finishLevels = finishLevels.map((item: { levelId: number }) => {
      return item.levelId
    })
    rewardLevels = rewardLevels.map((item: { levelId: number }) => {
      return item.levelId
    })
    const arr: any[] = rows.map((item: { id: number; title: string }) =>
      Object.assign(item, {
        active: false,
        disable: !finishLevels.includes(item.id),
        finish: finishLevels.includes(item.id),
        reward: rewardLevels.includes(item.id),
      })
    )
    const index = arr.findLastIndex((item) => {
      return item.finish
    })
    if (index < arr.length - 1) {
      arr[index + 1].active = true
      arr[index + 1].disable = false
    }

    rows = (await con.execute(
      "SELECT pm.name as module, pu.name as unit FROM practice_module pm, practice_unit pu where pm.id = pu.module_id and pu.id = ?",
      [query.id]
    )) as any

    const rtn = { types: rows[0][0], arr }

    return responseJson(event, 200, "ok", rtn)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
