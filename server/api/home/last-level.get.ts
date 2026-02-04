import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const con = await getDB()

  try {
    const uid = event.context.uid
    let [rows] = (await con.execute(
      "SELECT pm.id as moduleId, pu.id as unitId, pm.name as module, pu.name as unit FROM practice_user_level as pul, practice_module as pm, practice_unit as pu WHERE user_id = ? AND pul.unit_id = pu.id AND pu.module_id = pm.id ORDER BY finish_time DESC LIMIT 1",
      [uid]
    )) as any
    const data = rows[0]
    const { unitId } = data

    ;[rows] = (await con.execute(
      "SELECT Count(practice_unit.id) as total FROM practice_unit, practice_level WHERE practice_unit.id = ? and practice_level.unit_id = practice_unit.id",
      [unitId]
    )) as any
    const total = rows[0].total

    ;[rows] = (await con.execute(
      "SELECT COUNT(DISTINCT pul.level_id) AS passed_count FROM practice_unit pu LEFT JOIN practice_user_level pul ON pu.id = pul.unit_id AND pul.user_id = ? WHERE pu.id = ? GROUP BY pu.id",
      [uid, unitId]
    )) as any
    data.percent = (rows[0].passed_count / total).toFixed(3)

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
