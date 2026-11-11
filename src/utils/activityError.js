/**
 * 依活動載入失敗的原因決定錯誤畫面的內容
 *
 * 活動被後台刪除後，連結仍留在粉絲手上，後端回 404；此時重試不會成功，
 * 也不該顯示「找不到資源」這類後端技術訊息，改成粉絲看得懂的說明並拿掉重試按鈕。
 * @param {{ status?: number, message?: string }} error - 載入活動時拋出的錯誤
 * @returns {{ title: string, message: string, canRetry: boolean }} 錯誤畫面內容
 */
export const getActivityErrorView = (error) => {
  if (error?.status === 404) {
    return {
      title: '活動不存在或已下架',
      message: '這個投票活動已下架，或連結有誤。',
      canRetry: false,
    }
  }

  return {
    title: '活動載入失敗',
    message: error?.message || '請稍後再試',
    canRetry: true,
  }
}
