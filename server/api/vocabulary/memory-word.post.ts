import Joi from "joi"
import dayjs from "dayjs"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { delCache, generateCacheKey } from "~/utils/cache"

const MaxProficiency = 100
const MinEaseFactor = 2.5
const maxInterval = 12

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    id: Joi.any().required(),
    isRemember: Joi.any().required(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const { isRemember, id } = body

    const uid = event.context.uid
    const [authRows] = (await con.execute(
      "SELECT * FROM vocabulary_list WHERE id = ? AND user_id = ?",
      [id, uid]
    )) as any
    if (!authRows.length) return responseJson(event, 403, "无权限", {})

    const [wordRows] = (await con.execute(
      "SELECT * FROM vocabulary_list WHERE id = ?",
      [id]
    )) as any
    const {
      ease_factor,
      streak,
      proficiency,
      review_count,
      interval,
      last_review_time,
      status,
    } = wordRows[0]

    let newInterval
    let newProficiency, newEaseFactor, newStreak
    let newReviewCount = status ? review_count + 1 : 0
    let newStatus = 1
    if (isRemember) {
      newStreak = streak + 1
      newProficiency = Math.min(MaxProficiency, proficiency + 25)
      newEaseFactor = Math.min(MinEaseFactor, ease_factor + 0.1)
      newStatus = newProficiency === 100 ? 2 : newStatus
      if (streak === 0) newInterval = 1
      else if (streak === 1) newInterval = 2
      else if (streak === 2) newInterval = 4
      else
        newInterval = Math.min(
          maxInterval,
          Math.floor(interval * newEaseFactor)
        )
    } else {
      newProficiency = Math.max(0, proficiency - 30)
      newStreak = 0
      newEaseFactor = Math.max(MinEaseFactor, ease_factor - 0.2)
      newInterval = 0
    }
    const nextReviewTime = dayjs().add(newInterval, "day").format("YYYY-MM-DD")
    const today = dayjs().format("YYYY-MM-DD")

    await con.execute(
      "UPDATE vocabulary_list set proficiency = ?, streak = ?, review_count = ?, ease_factor = ?, status = ?, update_time = NOW(), last_review_time = ?, next_review_time = ?, `interval` = ? where id = ?",
      [
        newProficiency,
        newStreak,
        newReviewCount,
        newEaseFactor,
        newStatus,
        isRemember || last_review_time ? today : last_review_time,
        nextReviewTime,
        newInterval,
        id,
      ]
    )

    await delCache(generateCacheKey("vocabulary:record-list", { uid }))

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
