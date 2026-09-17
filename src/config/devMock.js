/**
 * 本機預覽模式的偵測
 *
 * 只在 dev 且網址帶 ?mock=xxx 時啟用。假資料放在 devMockData.js 並以動態 import 載入，
 * 正式打包時整段會被移除，不會把假資料帶進交給後端的產物。
 */
export const getDevMockScenario = () => {
  // node 測試環境沒有 import.meta.env，用 optional chaining 避免存取錯誤
  if (!import.meta.env?.DEV || typeof window === 'undefined') {
    return ''
  }
  return new URLSearchParams(window.location.search).get('mock') ?? ''
}

/**
 * 預覽模式要直接開啟的畫面
 * @returns {string} home / vote / result，未指定時為空字串
 */
export const getDevMockScreen = () => {
  if (!getDevMockScenario()) {
    return ''
  }
  return new URLSearchParams(window.location.search).get('screen') ?? ''
}
