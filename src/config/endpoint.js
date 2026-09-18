const REQUIRED_KEYS = ['lineCrmApiBaseUrl', 'voteActivityId']

export const getEndpoint = () => {
  const endpoint = window.endpoint ?? {}
  const missingKeys = REQUIRED_KEYS.filter((key) => !String(endpoint[key] ?? '').trim())

  if (missingKeys.length > 0) {
    throw new Error('缺少啟動設定：' + missingKeys.join('、'))
  }

  return {
    liffId: endpoint.liffId ?? '',
    basicId: endpoint.basicId ?? '',
    lineCrmApiBaseUrl: String(endpoint.lineCrmApiBaseUrl).replace(/\/$/, ''),
    voteActivityId: String(endpoint.voteActivityId),
    enableLiff: endpoint.enableLiff !== false,
  }
}

export const getLiffApiUrl = (path = '') => {
  const endpoint = getEndpoint()
  return `${endpoint.lineCrmApiBaseUrl}/api/liff/vote_activities/${endpoint.voteActivityId}${path}`
}
