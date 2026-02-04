import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { getVocabularyReviewWords } from "../vocabulary/daily-memory-words.post"

export default defineEventHandler(async (event) => {
  const con = await getDB()

  try {
    const uid = event.context.uid

    const [ongoingRecordRows] = (await con.execute(
      "SELECT vr.*, vb.title as title, vb.cover as cover, vb.remark as remark, vb.is_system as isSystem FROM vocabulary_record as vr, vocabulary_book as vb WHERE vr.book_id = vb.id AND vr.user_id = ? ORDER BY update_time DESC",
      [uid]
    )) as any
    if (ongoingRecordRows.length === 0)
      return responseJson(event, 200, "ok", undefined)
    const { id: recordId } = ongoingRecordRows[0]

    const [wordsRows] = (await con.execute(
      "SELECT * FROM vocabulary_list WHERE record_id = ?",
      [recordId]
    )) as any
    const total = wordsRows.length
    let masteredSum = 0
    let ongoningSum = 0
    let notLearnSum = 0

    for (const word of wordsRows) {
      if (word.status === 2) masteredSum++
      else if (word.status === 1) ongoningSum++
      if (word.status === 0) notLearnSum++
    }

    const { todayReadyToLearnNums, todayHaveLearnNums } =
      await getVocabularyReviewWords(con, recordId)

    const data = {
      record: ongoingRecordRows[0],
      total,
      masteredSum,
      ongoningSum,
      notLearnSum,
      todayReadyToLearnNums,
      todayHaveLearnNums,
    }

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
