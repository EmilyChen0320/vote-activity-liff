import assert from 'node:assert/strict'
import test from 'node:test'

const { getActivityErrorView } = await import('../src/utils/activityError.js')

test('活動不存在（404）顯示已下架說明，不提供重試', () => {
  const view = getActivityErrorView({ status: 404, message: '找不到資源' })

  assert.equal(view.title, '活動不存在或已下架')
  assert.doesNotMatch(view.message, /找不到資源/)
  assert.equal(view.canRetry, false)
})

test('其他錯誤顯示載入失敗與後端訊息，保留重試', () => {
  const view = getActivityErrorView({ status: 500, message: '伺服器忙碌中' })

  assert.equal(view.title, '活動載入失敗')
  assert.equal(view.message, '伺服器忙碌中')
  assert.equal(view.canRetry, true)
})

test('網路錯誤沒有 status 時也保留重試', () => {
  const view = getActivityErrorView(new TypeError('Failed to fetch'))

  assert.equal(view.title, '活動載入失敗')
  assert.equal(view.canRetry, true)
})
