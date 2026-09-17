/**
 * 本機開發與暫時預覽用的啟動設定
 *
 * 正式環境的 `window.endpoint` 由後端 Blade 頁面外殼注入，
 * dev 與 preview 模式沒有外殼，改由環境變數補上，否則 getEndpoint() 會因缺少必填鍵而丟錯。
 *
 * IS_ENABLED 寫成 typeof 檢查而非 optional chaining，有兩個原因：
 * 1. node 測試環境沒有 import.meta.env，直接存取會炸。
 * 2. vite 只會替換 `import.meta.env.DEV` 這種完整寫法，用 `?.` 會讓它無法在打包時
 *    折疊成常數，整段（連同環境變數的值）就會被留在正式產物裡。
 */
const IS_ENABLED =
  (typeof import.meta.env !== 'undefined' && import.meta.env.DEV === true) ||
  (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_PREVIEW === 'true')

export const applyDevEndpoint = () => {
  if (!IS_ENABLED) {
    return
  }

  const devEndpoint = {
    liffId: import.meta.env.VITE_DEV_LIFF_ID ?? '',
    basicId: import.meta.env.VITE_DEV_BASIC_ID ?? '',
    oaName: import.meta.env.VITE_DEV_OA_NAME ?? '',
    lineCrmApiBaseUrl: import.meta.env.VITE_DEV_LINE_CRM_API_BASE_URL ?? '',
    voteActivityId: import.meta.env.VITE_DEV_VOTE_ACTIVITY_ID ?? '',
    enableLiff: import.meta.env.VITE_DEV_ENABLE_LIFF === 'true',
  }

  const injected = window.endpoint ?? {}
  // 後端外殼若已注入字串值就不覆蓋，只補齊空白欄位。
  // 布林欄位一律採用環境變數：index.html 的預設值是 false，
  // 若沿用「有值就不覆蓋」的判斷，false 會被當成已提供而蓋掉設定。
  window.endpoint = Object.fromEntries(
    Object.entries(devEndpoint).map(([key, value]) => {
      if (typeof value === 'boolean') {
        return [key, value]
      }
      return [key, String(injected[key] ?? '').trim() ? injected[key] : value]
    }),
  )
}
