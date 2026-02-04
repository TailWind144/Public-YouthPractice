import { responseJson } from "../utils/helper"
import { secret, noAuth } from "../utils/const"
// @ts-ignore
import jwt from "jsonwebtoken"
import base64url from "base64url"

export default defineEventHandler((event) => {
  if (!event.path.startsWith("/api")) return

  if (noAuth.some((path) => event.path === path)) return

  const token = getCookie(event, "token")
  if (!token) return responseJson(event, 403, "无效的身份凭证", {})

  try {
    event.context.uid = base64url.decode(jwt.verify(token, secret).data.uid64)
  } catch (error) {
    return responseJson(event, 403, "无效的身份凭证", {})
  }

  return
})
