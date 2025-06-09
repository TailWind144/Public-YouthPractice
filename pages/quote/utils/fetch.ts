export const getSentence = (data = {}) => {
  return _fetch("/api/quote/daily-sentence", { query: data })
}

export const LoveSentence = (data) => {
  return _fetch("/api/quote/love-sentence", { method: "post", body: data })
}

export const getQuoteList = (data) => {
  return _fetch("/api/quote/quote-list", { query: data })
}
