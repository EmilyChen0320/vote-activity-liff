import assert from 'node:assert/strict'
import test from 'node:test'

const { getAddFriendUrl } = await import('../src/utils/friend.js')

test('加好友連結使用 basic ID 組成', () => {
  assert.equal(getAddFriendUrl('@abc1234'), 'https://line.me/R/ti/p/%40abc1234')
})

test('basic ID 沒帶 @ 時自動補上', () => {
  assert.equal(getAddFriendUrl('abc1234'), 'https://line.me/R/ti/p/%40abc1234')
})

test('沒有 basic ID 時回空字串', () => {
  assert.equal(getAddFriendUrl(''), '')
  assert.equal(getAddFriendUrl(null), '')
  assert.equal(getAddFriendUrl('  '), '')
})
