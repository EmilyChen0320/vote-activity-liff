import { getLiffApiUrl } from '../config/endpoint.js'

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

const request = (path = '', { method = 'GET', token = '', body } = {}) => {
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
