import { responseJson } from "@/server/utils/helper"

export default defineEventHandler(async (event) => {
  try {
    deleteCookie(event, "token")
    return responseJson(event, 200, "ok", {})
  } catch (e: any) {
    console.log(e)
    return responseJson(event, 500, e, {})
  }
})
