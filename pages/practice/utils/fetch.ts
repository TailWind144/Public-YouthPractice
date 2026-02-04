export const getModules = () => {
  return _fetch("/api/practice/module", {})
}

export const getUnits = (data) => {
  return _fetch("/api/practice/unit", { query: data })
}

export const getLevels = (data) => {
  return _fetch("/api/practice/level", { query: data })
}

export const getLevelHistory = (data) => {
  return _fetch("/api/practice/level-history", { query: data })
}
