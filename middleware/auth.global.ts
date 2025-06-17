import type { User } from "~/types/user"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig()
  if (to.path === "/") return navigateTo(config.public.homeBase)
  if (to.path === "/login") return
  const userState = useState<User>("userState")
  if (!userState.value) {
    const res = await getCheck()
    if (res?.data) userState.value = res.data
    else return navigateTo("/login")
  }
})
