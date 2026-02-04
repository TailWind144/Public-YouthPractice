import dayjs from "dayjs"
import { quoteTimeFormat } from "./const"

export function getRandomIndex(
  length: number,
  date = dayjs().format(quoteTimeFormat)
): number {
  const current = dayjs(date, quoteTimeFormat).date()
  return current % length
}
