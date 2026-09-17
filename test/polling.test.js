import assert from 'node:assert/strict'
import test from 'node:test'

const { POLLING_INTERVAL } = await import('../src/stores/voteActivity.js')

test('即時結果輪詢間隔不少於 5 秒', () => {
  assert.ok(POLLING_INTERVAL >= 5000)
})
