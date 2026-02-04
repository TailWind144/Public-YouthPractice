import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import Joi from "joi"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    id: Joi.any().optional(),
    units: Joi.any().optional(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    let recordId = body.id
    if (!recordId) {
      const uid = event.context.uid
      const [rows] = (await con.execute(
        "SELECT * FROM vocabulary_record WHERE user_id = ? ORDER BY update_time DESC",
        [uid]
      )) as any
      recordId = rows[0].id
    }

    let data
    const { units } = body
    if (units) {
      data = await getVocabularyNewWords(con, recordId, units)
    } else data = await getVocabularyReviewWords(con, recordId)

    await con.execute(
      "UPDATE vocabulary_record set update_time = NOW() where id = ?",
      [recordId]
    )

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})

export const getVocabularyReviewWords = async (con: any, recordId: any) => {
  const sql =
    "SELECT vl.*, vbw.word as word, vbw.book_meaning as book_meaning, vbw.symbol as symbol, vbw.example as example, vbw.stage as stage, vbw.card_mode as card_mode FROM vocabulary_list as vl, vocabulary_book_words as vbw WHERE vl.word_id = vbw.id"

  const [dueReviewsRows] = (await con.execute(
    sql +
      " AND record_id = ? AND status = 1 AND next_review_time <= CURRENT_DATE ORDER BY proficiency ASC",
    [recordId]
  )) as any

  const [todayReadyToReviewNumsRows] = (await con.execute(
    "SELECT Count(id) as nums FROM vocabulary_list WHERE record_id = ? AND ((status = 1 AND next_review_time <= CURRENT_DATE) OR (last_review_time = CURRENT_DATE AND (review_count != 0 OR is_system = 0)))",
    [recordId]
  )) as any
  let todayReadyToLearnNums = todayReadyToReviewNumsRows[0].nums
  const [todayHaveReviewNumsRows] = (await con.execute(
    "SELECT Count(id) as nums FROM vocabulary_list WHERE record_id = ? AND last_review_time = CURRENT_DATE AND (review_count != 0 OR is_system = 0)",
    [recordId]
  )) as any
  const todayHaveLearnNums = todayHaveReviewNumsRows[0].nums

  // const MinReviewNums = 20
  // if (todayReadyToReviewNums < MinReviewNums) {
  //   const [extraWordsRows] = (await con.execute(
  //     sql +
  //       " AND record_id = ? AND proficiency >= 50 AND last_review_time <= DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY) ORDER BY RAND(666) LIMIT 100",
  //     [recordId]
  //   )) as any
  //   dueReviewsRows.push(...extraWordsRows)
  //   todayReadyToReviewNums += extraWordsRows.length
  // }

  return {
    words: dueReviewsRows,
    todayReadyToLearnNums,
    todayHaveLearnNums,
  }
}

export const getVocabularyNewWords = async (
  con: any,
  recordId: any,
  units: any
) => {
  const sql =
    "SELECT vl.*, vbw.word as word, vbw.book_meaning as book_meaning, vbw.symbol as symbol, vbw.example as example, vbw.stage as stage, vbw.card_mode as card_mode FROM vocabulary_list as vl, vocabulary_book_words as vbw WHERE vl.word_id = vbw.id"

  const newWords = []
  let totalWordsNums = 0
  for (const [unit, sections] of Object.entries(units)) {
    if (!sections.length) continue
    const [newWordsRows] = (await con.execute(
      sql +
        ` AND record_id = ? AND isnull(last_review_time) AND vbw.unit = ? AND vbw.section in (${sections.join()})`,
      [recordId, unit]
    )) as any
    newWords.push(...newWordsRows)

    const [wordsRows] = (await con.execute(
      sql +
        ` AND record_id = ? AND vbw.unit = ? AND vbw.section in (${sections.join()})`,
      [recordId, unit]
    )) as any
    totalWordsNums += wordsRows.length
  }

  const todayReadyToLearnNums = totalWordsNums
  const todayHaveLearnNums = totalWordsNums - newWords.length

  return {
    words: newWords,
    todayReadyToLearnNums,
    todayHaveLearnNums,
  }
}
