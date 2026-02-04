import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const con = await getDB()
  try {
    const uid = event.context.uid
    let [rows] = (await con.execute(
      "SELECT id as uid, nickname, points, experience, cur_level as level, role, grade, teacher_id as teacherId FROM user_info WHERE id = ?",
      [uid]
    )) as any
    console.log("rows", rows)

    return responseJson(event, 200, "ok", rows[0])
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
