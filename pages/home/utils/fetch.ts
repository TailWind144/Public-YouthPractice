export const getUserDataDetail = () => {
  return _fetch("/api/home/user-data-detail", {})
}

export const getLastLevel = () => {
  return _fetch("/api/home/last-level", {})
}

export const getOngoingVocabularyData = () => {
  return _fetch("/api/home/ongoing-vocabulary-data", {})
}

export const unfinishedDictation = (data) => {
  return _fetch("/api/dictation/unfinished-dictation", { query: data })
}

export const userDictationRecord = (data) => {
  return _fetch("/api/dictation/user-dictation-records", { query: data })
}

export const adminDictationRecord = (data) => {
  return _fetch("/api/dictation/dictation-tasks", { query: data })
}
