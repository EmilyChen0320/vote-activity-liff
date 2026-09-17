import assert from 'node:assert/strict'
import test from 'node:test'

global.window = {
  endpoint: {
    liffId: 'test-liff-id',
    basicId: '@test',
    lineCrmApiBaseUrl: 'https://feature-line-crm.aitago.tw/',
    voteActivityId: '01TESTVOTE',
    enableLiff: false,
  },
}

const { getEndpoint } = await import('../src/config/endpoint.js')

test('正規化後端注入的投票活動設定', () => {
  assert.deepEqual(getEndpoint(), {
    liffId: 'test-liff-id',
    basicId: '@test',
    lineCrmApiBaseUrl: 'https://feature-line-crm.aitago.tw',
    voteActivityId: '01TESTVOTE',
    enableLiff: false,
  })
})

test('缺少必要設定時阻止應用程式啟動', () => {
  window.endpoint = {}
  assert.throws(() => getEndpoint(), /lineCrmApiBaseUrl、voteActivityId/)
})
