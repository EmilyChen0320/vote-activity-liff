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
    // 導覽列標題用的官方帳號／節目名稱，外殼未提供時由畫面退回活動名稱
    oaName: endpoint.oaName ?? '',
    lineCrmApiBaseUrl: String(endpoint.lineCrmApiBaseUrl).replace(/\/$/, ''),
    voteActivityId: String(endpoint.voteActivityId),
    enableLiff: endpoint.enableLiff !== false,
  }
}

export const getLiffApiUrl = (path = '') => {
  const endpoint = getEndpoint()
  return `${endpoint.lineCrmApiBaseUrl}/api/liff/vote_activities/${endpoint.voteActivityId}${path}`
}
