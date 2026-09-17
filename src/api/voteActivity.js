import { getDevMockScenario } from '../config/devMock.js'
import { getLiffApiUrl } from '../config/endpoint.js'

// 寫成 typeof 檢查，node 測試環境沒有 import.meta.env 也不會炸，
// 而 vite 打包時會把 import.meta.env.DEV 換成 false 讓整個常數被折疊
const IS_MOCKABLE =
  (typeof import.meta.env !== 'undefined' && import.meta.env.DEV === true) ||
  (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_PREVIEW === 'true')

export class VoteActivityApiError extends Error {
  constructor(message, { status = 0, code = '', errors = null } = {}) {
    super(message)
    this.name = 'VoteActivityApiError'
    this.status = status
    this.code = code
    this.errors = errors
  }
}

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new VoteActivityApiError(payload.message || '操作失敗，請稍後再試', {
      status: response.status,
      code: payload.code,
      errors: payload.result?.errors ?? null,
    })
  }
  return payload.result
}

const request = async (path = '', { method = 'GET', token = '', body } = {}) => {
  // 本機預覽模式：直接回假資料，不打 API。
  // IS_MOCKABLE 在正式打包時會被折疊成 false，整段（含動態 import）都會被移除。
  if (IS_MOCKABLE) {
    const scenario = getDevMockScenario()
    if (scenario) {
      const { getDevMockResponse } = await import('../config/devMockData.js')
      const mock = getDevMockResponse(scenario, path)
      if (mock) {
        return mock
      }
    }
  }

  const headers = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  return fetch(getLiffApiUrl(path), {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  }).then(parseResponse)
}

export const getActivity = (token = '') => request('', { token })
export const submitVote = ({ itemIds, answerText = '', token = '' }) =>
  request('/vote', {
    method: 'POST',
    token,
    body: {
      item_ids: itemIds,
      ...(answerText.trim() ? { answer_text: answerText.trim() } : {}),
    },
  })
export const getResult = (token = '') => request('/result', { token })
