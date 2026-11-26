/**
 * 組出加入官方帳號好友的連結
 * @param {string} basicId - 官方帳號 basic ID（例：@abc1234）
 * @returns {string} 加好友連結；沒有 basic ID 時回空字串
 */
export const getAddFriendUrl = (basicId = '') => {
  const id = String(basicId ?? '').trim()
  if (!id) return ''
  const normalized = id.startsWith('@') ? id : `@${id}`
  return `https://line.me/R/ti/p/${encodeURIComponent(normalized)}`
}
