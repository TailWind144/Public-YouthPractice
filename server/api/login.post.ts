import Joi from "joi"
import md5 from "md5"
import getDB from "@/server/db/mysql"
import { responseJson } from "@/server/utils/helper"
// @ts-ignore
import jwt from "jsonwebtoken"
import base64url from "base64url"
import { salt, secret } from "@/server/utils/const"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  })
  try {
    await schema.validateAsync(body)
  } catch (e) {
    return responseJson(event, 400, "参数错误", {})
  }

  const password = md5(md5(body.password) + salt)
  const con = await getDB()
  try {
    let [rows] = (await con.execute(
      "SELECT id as uid, nickname, points, experience, cur_level as level, role, grade, teacher_id as teacherId FROM user_info WHERE username = ? AND password = ?",
      [body.username, password]
    )) as any
    console.log("rows", rows)

    if (rows.length === 0)
      return responseJson(event, 403, "账号不存在或密码错误", {})

    const uid = rows[0].uid.toString()
    const uid64 = base64url(uid)
    const token = jwt.sign(
      {
        data: { uid64, date: new Date() },
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14,
      },
      secret
    )
    setCookie(event, "token", token, {
      maxAge: 60 * 60 * 24 * 14,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    })

    return responseJson(event, 200, "ok", rows[0])
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  } finally {
    con.release()
  }
})
