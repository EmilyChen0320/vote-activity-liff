/**
 * 本機預覽模式的偵測
 *
 * 只在 dev 且網址帶 ?mock=xxx 時啟用。假資料放在 devMockData.js 並以動態 import 載入，
 * 正式打包時整段會被移除，不會把假資料帶進交給後端的產物。
 */
// 寫成 typeof 檢查而非 optional chaining，vite 才能在正式打包時折疊成 false，
// 讓整段連同假資料一起被移除；preview（Vercel 暫時預覽）也要能用，方便驗收各種狀態
const IS_ENABLED =
  (typeof import.meta.env !== 'undefined' && import.meta.env.DEV === true) ||
  (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_PREVIEW === 'true')

export const getDevMockScenario = () => {
  if (!IS_ENABLED || typeof window === 'undefined') {
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
