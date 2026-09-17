/**
 * 本機開發用的啟動設定
 *
 * 正式環境的 `window.endpoint` 由後端 Blade 頁面外殼注入，
 * 本機沒有外殼，改由 .env.local 的環境變數補上，否則 getEndpoint() 會因缺少必填鍵而丟錯。
 * 只在 dev 生效，打包後不會改寫任何設定。
 */
export const applyDevEndpoint = () => {
  // node 測試環境沒有 import.meta.env，用 optional chaining 避免存取錯誤
  if (!import.meta.env?.DEV) {
    return
  }

  const devEndpoint = {
    liffId: import.meta.env?.VITE_DEV_LIFF_ID ?? '',
    basicId: import.meta.env?.VITE_DEV_BASIC_ID ?? '',
    oaName: import.meta.env?.VITE_DEV_OA_NAME ?? '',
    lineCrmApiBaseUrl: import.meta.env?.VITE_DEV_LINE_CRM_API_BASE_URL ?? '',
    voteActivityId: import.meta.env?.VITE_DEV_VOTE_ACTIVITY_ID ?? '',
    enableLiff: import.meta.env?.VITE_DEV_ENABLE_LIFF === 'true',
  }

  const injected = window.endpoint ?? {}
  // 後端外殼若已注入就不覆蓋，只補齊空白欄位
  window.endpoint = Object.fromEntries(
    Object.entries(devEndpoint).map(([key, value]) => [
      key,
      String(injected[key] ?? '').trim() ? injected[key] : value,
    ]),
  )
}
