import { Message } from "@arco-design/web-vue"

type RtnData = {
  status: number
  msg: string
  data: any
}

export const s_fetch = async (url: string, options: any) => {
  return useFetch(url, {
    ...options,
  }).then((res) => {
    return res.data.value as RtnData
  })
}

export const c_fetch = async (url: string, options: any) => {
  return $fetch<Promise<RtnData>>(url, {
    ...options,
  }).catch((err) => {
    if (err.data) Message.error(err.data.msg)
    return err.data as RtnData
  })
}

export const _fetch = async (url: string, options: any = {}) => {
  return import.meta.server ? s_fetch(url, options) : c_fetch(url, options)
}
