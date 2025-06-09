export const getUserItems = () => {
  return _fetch("/api/shop/user-items", {})
}

export const getShopItems = () => {
  return _fetch("/api/shop/shop-items", {})
}

export const buyShopItems = (data) => {
  return _fetch("/api/shop/buy-items", { method: "post", body: data })
}
