import Joi from "joi"
import getDB from "@/server/db/mysql"
import md5 from "md5"
import { responseJson } from "@/server/utils/helper"
import { salt } from "@/server/utils/const"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    username: Joi.string().min(4).required(),
    password: Joi.string()
      .min(6)
      .pattern(/^(?=.*[a-z])(?=.*\d)[a-z\d]+$/)
      .required(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const con = await getDB()
  try {
    const [rows] = (await con.execute(
      "SELECT * FROM user_info WHERE username = ?",
      [body.username]
    )) as any

    if (rows.length) return responseJson(event, 403, "用户名已存在", {})

    const password = md5(md5(body.password) + salt)
    let [_rows] = (await con.execute(
      "SELECT COUNT(id) as sum FROM user_info"
    )) as any
    const index = _rows[0].sum
    ;[_rows] = (await con.execute(
      "INSERT INTO user_info(`username`, `password`, `nickname`) VALUES (?, ?, ?)",
      [body.username, password, `用户#${index}`]
    )) as any

    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
