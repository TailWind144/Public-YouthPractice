import type { H3Event } from "h3"
import { expArr } from "./const"

export const responseJson = (
  event: H3Event,
  status: number,
  msg: string,
  data: any
) => {
  setResponseStatus(event, status)
  return { status: status, msg, data }
}

export const getTargetLevel = (exp: number) => {
  if (exp < 900) return 1 + Math.floor(exp / expArr[0])
  else if (exp < 2900) return 10 + Math.floor((exp - 900) / expArr[1])
  else return 20 + Math.floor((exp - 2900) / expArr[2])
}

export const groupByKey = <T, K extends keyof T>(arr: T[], key: K) => {
  const obj: Record<string, T[]> = {}
  for (const item of arr) {
    const groupKey = String(item[key])
    obj[groupKey] ? obj[groupKey].push(item) : (obj[groupKey] = [item])
  }
  return obj
}

export const updateItemNums = async (
  con: any,
  uid: any,
  itemId: any,
  targetNums: any
) => {
  if (targetNums === 0) {
    await con.execute(
      "DELETE FROM user_items WHERE user_id = ? and item_id = ?",
      [uid, itemId]
    )
  } else
    await con.execute(
      "UPDATE user_items set nums = ? where user_id = ? and item_id = ?",
      [targetNums, uid, itemId]
    )
}
