import assert from 'node:assert/strict'
import test from 'node:test'

global.window = { endpoint: { lineCrmApiBaseUrl: 'https://example.test', voteActivityId: '01VOTE' } }
const calls = []
global.fetch = async (url, options) => {
  calls.push({ url, options })
  return { ok: true, json: async () => ({ result: { ok: true } }) }
}
const { getActivity, submitVote } = await import('../src/api/voteActivity.js')

test('第一次載入活動不攜帶 token', async () => {
  await getActivity()
  assert.equal(calls[0].options.headers.Authorization, undefined)
})

test('投票 request 只送選項與開放輸入', async () => {
  await submitVote({ itemIds: ['A'], answerText: ' 加油 ', token: 'TOKEN' })
  assert.deepEqual(JSON.parse(calls[1].options.body), { item_ids: ['A'], answer_text: '加油' })
  assert.equal(calls[1].options.headers.Authorization, 'Bearer TOKEN')
})
