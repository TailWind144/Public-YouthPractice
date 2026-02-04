import Joi from "joi"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
import { optionToStr } from "@/server/utils/const"
import { generateCacheKey, getCache, setCache } from "~/utils/cache"

const tabelToQuery = {
  practice_options: queryOptions,
  practice_box: queryBox,
  practice_matching: queryMatching,
}

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

  const cacheKey = generateCacheKey("questions:content", query)
  const cache = await getCache(cacheKey)
  if (cache) {
    console.log("使用缓存返回练习题目信息")
    return responseJson(event, 200, "ok", cache)
  }

  const con = await getDB()
  try {
    let [rows] = (await con.execute(
      "SELECT content, `table` FROM practice_stem, practice_stem_type where practice_stem.id = ? and `type` = practice_stem_type.id",
      [query.id]
    )) as any

    if (rows.length === 0) return responseJson(event, 403, "题目不存在", {})

    const stem = rows[0].content
    const table: keyof typeof tabelToQuery = rows[0].table

    const [types] = (await con.execute(
      "SELECT pu.id as unitId, pl.index, pm.name as module, pu.name as unit FROM practice_module pm, practice_unit pu, practice_level pl where pl.unit_id = pu.id and pm.id = pl.module_id and pl.stem_id = ?",
      [query.id]
    )) as any

    const data = await tabelToQuery[table](con, query.id, stem, types)

    data.answersLength = await getAnswersLength(con, query.id)

    await setCache(cacheKey, data, 7200)

    return responseJson(event, 200, "ok", data)
  } catch (e: any) {
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})

async function queryOptions(con: any, id: any, stem: string, types: any[]) {
  const [rows] = (await con.execute(
    "SELECT question, op1, op2, op3, op4 FROM practice_questions, practice_options WHERE practice_questions.stem_id = ? AND practice_questions.id = practice_options.que_id",
    [id]
  )) as any

  const data: {
    stem: string
    multiples: any[]
    kind: string
    types: any
    answersLength?: number
  } = {
    stem,
    multiples: [],
    kind: rows[0].question ? "selectOptions" : "options",
    types: types[0],
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

  return data
}

async function queryBox(con: any, id: any, stem: string, types: any[]) {
  let [rows] = (await con.execute(
    "SELECT * FROM practice_box where stem_id = ?",
    [id]
  )) as any

  const data: {
    stem: string
    multiples: any[]
    kind: string
    types: any
    answersLength?: number
  } = {
    stem,
    multiples: [],
    kind: "box",
    types: types[0],
  }

  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (key.startsWith("word") && row[key])
        data.multiples.push({ word: row[key] })
    }
  }

  return data
}

async function queryMatching(con: any, id: any, stem: string, types: any[]) {
  let [rows] = (await con.execute(
    "SELECT * FROM practice_questions where practice_questions.stem_id = ?",
    [id]
  )) as any

  const data: {
    stem: string
    multiples: any
    kind: string
    types: any
    answersLength?: number
  } = {
    stem,
    multiples: { questions: [], options: [] },
    kind: "matching",
    types: types[0],
  }

  for (const row of rows) data.multiples.questions.push(row.question)
  ;[rows] = (await con.execute(
    "SELECT * FROM practice_matching where stem_id = ?",
    [id]
  )) as any

  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (key.startsWith("op") && row[key])
        data.multiples.options.push({
          label: row[key],
          value: optionToStr[key],
        })
    }
  }

  return data
}

async function getAnswersLength(con: any, id: any) {
  const [rows] = (await con.execute(
    "SELECT count(`index`) as length FROM practice_questions WHERE practice_questions.stem_id = ?",
    [id]
  )) as any
  return rows[0].length
}
