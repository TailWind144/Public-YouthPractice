import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log("query", query)

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
    const [rows] = (await con.execute(
      "SELECT * FROM media_exercises where chapter_id = ?",
      [query.id]
    )) as any

    const data: {
      multiples: any[]
      kind: string
      answersLength?: number
    } = {
      multiples: [],
      kind: "options",
    }
    for (const row of rows) {
      const temp = []
      for (const key of Object.keys(row)) {
        if (key.startsWith("op") && row[key]) {
          temp.push({ label: row[key], value: optionToStr[key] })
        }
      }
      data.multiples.push({ question: row.question, options: temp })
    }

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
