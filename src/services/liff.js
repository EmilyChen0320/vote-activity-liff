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

export const closeLiffWindow = () => {
  if (window.liff?.isInClient?.()) window.liff.closeWindow()
  else window.close()
}
