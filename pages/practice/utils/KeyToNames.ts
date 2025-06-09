export default function (arr, key) {
  const obj = {}
  arr.forEach((item) => {
    obj[item[key]] = item.name
  })
  return obj
}
