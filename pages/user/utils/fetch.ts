export const editUserInfo = (data) => {
  return _fetch("/api/user/edit-info", { method: "post", body: data })
}
