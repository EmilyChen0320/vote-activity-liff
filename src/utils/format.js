const pad = (value) => String(value).padStart(2, '0')

/**
 * 把 API 回傳的時間字串轉成粉絲看得懂的格式
 *
 * 後端可能回 ISO 字串，直接顯示會變成 2026-09-17T00:00:00.000000Z 這種樣子。
 * @param {string} value - API 時間字串
 * @returns {string} YYYY/MM/DD HH:mm，無法解析時回原值
 */
export const formatDateTime = (value) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * 以字元數計算長度，與後端的 mb_strlen 對齊
 *
 * JavaScript 的 String.length 是 UTF-16 code unit 數，emoji 會被算成 2，
 * 會讓前端擋掉其實合法的內容。
 * @param {string} value - 要計算的字串
 * @returns {number} 字元數
 */
export const countCharacters = (value = '') => [...String(value)].length

/**
 * 把活動起訖時間組成主視覺上的日期標籤
 * @param {string} startAt - 開始時間
 * @param {string} endAt - 結束時間
 * @returns {string} 例如 2026-04-01 ~ 06-30，資料不齊時回空字串
 */
export const formatDateRange = (startAt, endAt) => {
  if (!startAt || !endAt) {
    return ''
  }

  const start = new Date(startAt)
  const end = new Date(endAt)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return ''
  }

  const startText = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`
  const endText = `${pad(end.getMonth() + 1)}-${pad(end.getDate())}`
  return `${startText} ~ ${endText}`
}
