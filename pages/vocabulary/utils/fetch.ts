export const getBookList = (data) => {
  return _fetch("/api/vocabulary/book-list", { query: data })
}

export const getBookOptions = (data = {}) => {
  return _fetch("/api/vocabulary/book-options", { query: data })
}

export const getBookUnitList = (data) => {
  return _fetch("/api/vocabulary/book-unit-list", { query: data })
}

export const addBookWords = (data) => {
  return _fetch("/api/vocabulary/add-book-words", {
    method: "post",
    body: data,
  })
}

export const postMemoryWord = (data) => {
  return _fetch("/api/vocabulary/memory-word", {
    method: "post",
    body: data,
  })
}

export const getDailyWords = (data = {}) => {
  return _fetch("/api/vocabulary/daily-memory-words", {
    method: "post",
    body: data,
  })
}

export const getRecordList = () => {
  return _fetch("/api/vocabulary/record-list", {})
}

export const deleteRecord = (data) => {
  return _fetch("/api/vocabulary/delete-record", { method: "post", body: data })
}

export const switchRecord = (data) => {
  return _fetch("/api/vocabulary/switch-record", { method: "post", body: data })
}

export const getCustomList = () => {
  return _fetch("/api/vocabulary/custom-list", {})
}

export const addCustom = (data) => {
  return _fetch("/api/vocabulary/add-custom", {
    method: "post",
    body: data,
  })
}

export const editCustom = (data) => {
  return _fetch("/api/vocabulary/edit-custom", {
    method: "post",
    body: data,
  })
}

export const deleteCustom = (data) => {
  return _fetch("/api/vocabulary/delete-custom", { method: "post", body: data })
}

export const getListInfo = (data) => {
  return _fetch("/api/vocabulary/list-info", { query: data })
}

export const getListWords = (data) => {
  return _fetch("/api/vocabulary/list-words", { query: data })
}

export const addCustomWord = (data) => {
  return _fetch("/api/vocabulary/add-custom-word", {
    method: "post",
    body: data,
  })
}

export const editCustomWord = (data) => {
  return _fetch("/api/vocabulary/edit-custom-word", {
    method: "post",
    body: data,
  })
}

export const deleteCustomWord = (data) => {
  return _fetch("/api/vocabulary/delete-custom-word", {
    method: "post",
    body: data,
  })
}

export const getUnitsOfBook = (data) => {
  return _fetch("/api/vocabulary/units-of-book", { query: data })
}

export const getSectionsOfUnit = (data) => {
  return _fetch("/api/vocabulary/sections-of-unit", { query: data })
}

export const importSystemWords = (data) => {
  return _fetch("/api/vocabulary/import-system-words", {
    method: "post",
    body: data,
  })
}

export const getSystemWordList = (data) => {
  return _fetch("/api/vocabulary/system-word-list", { query: data })
}

export const markMasterWord = (data) => {
  return _fetch("/api/vocabulary/mark-master-word", {
    method: "post",
    body: data,
  })
}
