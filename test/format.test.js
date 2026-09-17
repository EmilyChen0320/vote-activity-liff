import assert from 'node:assert/strict'
import test from 'node:test'

const fmt = await import('../src/utils/format.js')
const { countCharacters, formatDateTime } = fmt

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

test('投票頻率提示只在有限制時出現', () => {
  const { formatVoteFrequencyNotice: f } = fmt
  assert.equal(f('once_per_activity'), '每人限投 1 次，送出後無法更改')
  assert.equal(f('daily_once'), '每人每日可投 1 次')
  assert.equal(f('custom', 3), '活動期間每人限投 3 次')
  // 不限次數不提示，避免看起來像在鼓勵重複投票
  assert.equal(f('unlimited'), '')
  // custom 但沒給上限時不亂顯示
  assert.equal(f('custom', null), '')
})
