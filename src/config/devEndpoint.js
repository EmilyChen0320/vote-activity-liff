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
  (typeof import.meta.env !== 'undefined' && import.meta.env.MODE === 'preview')

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

  // 判斷外面是否已經有人注入過完整設定：後端 Blade 外殼、或 build:preview 的
  // inject-preview-endpoint.js 都會把值直接寫進 HTML。
  // 只要兩個必填鍵都有值就視為已注入，整包不要再動 —— 逐鍵合併會踩到布林欄位的坑：
  // enableLiff 為 true 時若用環境變數覆蓋，環境變數缺少就會被改成 false，
  // 導致明明設定好了卻出現「缺少 LIFF 設定」。
  const hasInjectedConfig =
    String(injected.lineCrmApiBaseUrl ?? '').trim() !== '' &&
    String(injected.voteActivityId ?? '').trim() !== ''

  if (!hasInjectedConfig) {
    window.endpoint = devEndpoint
  }

  // 允許用網址參數切換要開啟的活動，省得每換一場活動就要重新打包或重新部署
  const overrideActivityId = new URLSearchParams(window.location.search).get('activity')
  if (overrideActivityId) {
    window.endpoint = { ...window.endpoint, voteActivityId: overrideActivityId }
  }
}
