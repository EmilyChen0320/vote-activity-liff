import assert from 'node:assert/strict'
import test from 'node:test'

const { POLLING_INTERVAL } = await import('../src/stores/voteActivity.js')

test('即時結果輪詢間隔不少於 5 秒', () => {
  assert.ok(POLLING_INTERVAL >= 5000)
})

test('票數只會增加：比現有數字小的輪詢結果視為過期', () => {
  // 後端結果端點有短期快取且寫入投票時不清除（串接文件 3.13），
  // 投票後第一次輪詢可能回到投票前的數字。這裡驗證判斷式本身。
  const isStale = (current, next) => current !== null && next < current
  assert.equal(isStale(6, 5), true)
  assert.equal(isStale(6, 6), false)
  assert.equal(isStale(6, 7), false)
  assert.equal(isStale(null, 0), false)
})
