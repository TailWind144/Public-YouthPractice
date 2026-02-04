import type { H3Event } from "h3"
import { expArr } from "./const"
import dayjs from "dayjs"

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

export const formatSmartDateTime = function (input: string | Date): string {
  const now = dayjs()
  const finish = dayjs(input)
  if (finish.isSame(now, "day")) {
    return `今天 ${finish.format("HH:mm")}`
  } else if (finish.isSame(now.subtract(1, "day"), "day")) {
    return `昨天 ${finish.format("HH:mm")}`
  } else {
    return finish.format("YYYY-MM-DD HH:mm")
  }
}
