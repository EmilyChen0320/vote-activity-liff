import assert from 'node:assert/strict'
import test from 'node:test'

const { countCharacters, formatDateTime } = await import('../src/utils/format.js')

test('把 API 的 ISO 時間轉成可讀格式', () => {
  assert.equal(formatDateTime('2026-09-17T00:00:00.000000Z').length, 16)
  assert.match(formatDateTime('2026-09-17T00:00:00.000000Z'), /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$/)
})

test('無法解析的時間回傳原值，不顯示 Invalid Date', () => {
  assert.equal(formatDateTime('not-a-date'), 'not-a-date')
  assert.equal(formatDateTime(''), '')
})

test('字數以字元計算，與後端 mb_strlen 對齊', () => {
  // String.length 會把 emoji 算成 2，會誤擋掉其實合法的內容
  assert.equal('🎉'.length, 2)
  assert.equal(countCharacters('🎉'), 1)
  assert.equal(countCharacters('投票加油'), 4)
})
