export const login = (data) => {
  return c_fetch("/api/login", { method: "post", body: data })
}
export const register = (data) => {
  return c_fetch("/api/register", { method: "post", body: data })
}
