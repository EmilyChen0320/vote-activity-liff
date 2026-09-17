import { getEndpoint } from '../config/endpoint.js'

let initialized = false

export const getLiffToken = async () => {
  const { liffId, enableLiff } = getEndpoint()
  if (!enableLiff || !liffId) throw new Error('此活動需要 LINE 登入，但缺少 LIFF 設定')
  if (!window.liff) throw new Error('LIFF SDK 尚未載入')
  if (!initialized) {
    await window.liff.init({ liffId })
    initialized = true
  }
  if (!window.liff.isLoggedIn()) {
    window.liff.login({ redirectUri: window.location.href })
    return null
  }
  return window.liff.getAccessToken()
}

/**
 * 關閉頁面
 *
 * LINE 內建瀏覽器可用 liff.closeWindow() 真的關掉；一般瀏覽器分頁不是由程式開啟的，
 * window.close() 會被忽略（console 會出現 "Scripts may close only the windows that
 * were opened by them."），所以要回報失敗讓畫面給提示，而不是按了沒反應。
 * @returns {boolean} 是否真的關得掉
 */
export const closeLiffWindow = () => {
  if (window.liff?.isInClient?.()) {
    window.liff.closeWindow()
    return true
  }

  window.close()
  return false
}
