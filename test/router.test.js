import assert from 'node:assert/strict'
import test from 'node:test'
import { createMemoryHistory, createRouter } from 'vue-router'

import { createActivityRoutes } from '../src/router/routes.js'

const activityPage = { template: '<div />' }
const createTestRouter = () =>
  createRouter({
    history: createMemoryHistory('/'),
    routes: createActivityRoutes(activityPage),
  })

test('一般連結、LIFF 連結與預覽根路徑都掛載投票活動頁面', () => {
  const router = createTestRouter()
  const paths = [
    '/',
    '/vote/01TESTVOTE',
    '/liff/vote/01TESTVOTE',
  ]

  paths.forEach((path) => {
    const resolved = router.resolve(path)

    assert.equal(resolved.name, 'home')
    assert.equal(resolved.matched.length, 1)
    assert.equal(resolved.matched[0].components.default, activityPage)
  })
})

test('LIFF 路徑維持原網址，不會被加上 /vote base', () => {
  const router = createTestRouter()
  const resolved = router.resolve('/liff/vote/01TESTVOTE')

  assert.equal(resolved.href, '/liff/vote/01TESTVOTE')
})
