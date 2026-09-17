import { defineStore } from 'pinia'

import { getActivity, getResult, submitVote } from '../api/voteActivity.js'
import { getDevMockScreen } from '../config/devMock.js'
import { getEndpoint } from '../config/endpoint.js'
import { closeLiffWindow, getLiffToken } from '../services/liff.js'
import { countCharacters } from '../utils/format.js'

const POLLING_INTERVAL = 5000

export const useVoteActivityStore = defineStore('voteActivity', {
  state: () => ({
    loading: false, submitting: false, error: null, token: '', activity: null,
    items: [], phase: '', viewer: null, result: null, submitted: false,
    selectedIds: [], answerText: '', pollTimer: null,
    // 活動連結只有 /vote/{id} 一條路由，畫面切換用狀態控制而不是換網址
    screen: 'home',
    votedItemTitles: [],
    loginError: '',
    closeHint: false,
  }),
  getters: {
    votableItems: (state) => state.items.filter((item) => item.type !== 'open_text'),
    openTextItem: (state) => state.items.find((item) => item.type === 'open_text') ?? null,
    canVote: (state) => state.phase === 'ongoing' && state.viewer?.can_vote === true,
    hasVoted: (state) => state.submitted || state.viewer?.has_voted === true,
    needsLogin: (state) => state.viewer?.reason === 'login_required',
    votedStorageKey: () => `vote-activity:voted:${getEndpoint().voteActivityId}`,
    maxSelections: (state) => state.activity?.vote_mode === 'multiple' ? Number(state.activity.max_selections) || 1 : 1,
  },
  actions: {
    /**
     * 記住這次投給誰
     *
     * 後端的 viewer 只回 has_voted，不回「這個人投給哪些選項」，
     * 回訪時無從得知，只能先存在本機（清除瀏覽器資料或換裝置就會失效）。
     */
    rememberVotedItems(titles) {
      this.votedItemTitles = titles
      try {
        window.localStorage.setItem(this.votedStorageKey, JSON.stringify(titles))
      } catch {
        // 無痕模式等情況下寫入失敗不影響投票流程
      }
    },
    restoreVotedItems() {
      try {
        const saved = window.localStorage.getItem(this.votedStorageKey)
        this.votedItemTitles = saved ? JSON.parse(saved) : []
      } catch {
        this.votedItemTitles = []
      }
    },
    applyActivity(payload) {
      this.activity = payload.activity
      this.items = payload.items ?? []
      this.phase = payload.phase
      this.viewer = payload.viewer
      this.result = Object.hasOwn(payload, 'result') ? payload.result : null
    },
    async bootstrap() {
      this.loading = true
      this.error = null
      try {
        // 第一次一律不帶 token；需要登入時由使用者自己點「使用 LINE 登入」再走 login()，
        // 不在載入當下自動轉址，否則粉絲看不到活動說明就被帶去登入頁
        const payload = await getActivity()
        this.applyActivity(payload)
        if (this.viewer?.has_voted) {
          // 預覽模式直接用假資料帶入，正式情況從本機記錄還原
          this.votedItemTitles = payload.votedItemTitles ?? []
          if (!this.votedItemTitles.length) {
            this.restoreVotedItems()
          }
        }
        // 預覽模式可用 &screen= 直接開到投票頁或結果頁
        const previewScreen = getDevMockScreen()
        if (previewScreen) {
          this.screen = previewScreen
        }
        this.startPolling()
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    goToScreen(screen) {
      this.screen = screen
    },
    /** 關閉頁面；關不掉時顯示提示，不要讓按鈕像壞掉 */
    requestClose() {
      this.closeHint = !closeLiffWindow()
    },
    /** 使用者主動點「使用 LINE 登入」時才走登入流程 */
    async login() {
      this.loginError = ''
      try {
        const token = await getLiffToken()
        if (!token) return
        this.token = token
        this.applyActivity(await getActivity(token))
        this.startPolling()
      } catch (error) {
        // 登入失敗只在按鈕旁提示，不要把整頁換成「活動載入失敗」，
        // 否則使用者連活動內容都看不到，也不知道能不能重試
        this.loginError = error.message || '登入失敗，請稍後再試'
      }
    },
    toggleSelection(id) {
      if (this.activity?.vote_mode === 'single') {
        this.selectedIds = this.selectedIds.includes(id) ? [] : [id]
      } else if (this.selectedIds.includes(id)) {
        this.selectedIds = this.selectedIds.filter((itemId) => itemId !== id)
      } else if (this.selectedIds.length < this.maxSelections) {
        this.selectedIds = [...this.selectedIds, id]
      }
    },
    validateVote() {
      if (!this.selectedIds.length) return '請至少選擇一個選項'
      if (this.selectedIds.length > this.maxSelections) return `最多可選 ${this.maxSelections} 項`
      if (this.openTextItem?.required && !this.answerText.trim()) return '請填寫必填的開放輸入欄位'
      if (countCharacters(this.answerText) > 500) return '開放輸入內容不可超過 500 字'
      return ''
    },
    async submit() {
      const message = this.validateVote()
      if (message) throw new Error(message)
      if (this.submitting) return
      this.submitting = true
      try {
        const payload = await submitVote({ itemIds: this.selectedIds, answerText: this.answerText, token: this.token })
        this.submitted = true
        this.viewer = { ...this.viewer, can_vote: false, has_voted: true }
        this.result = payload?.result ?? null
        // 後端的 viewer 不會回傳「這個人投給誰」，只能記下本次送出的選擇
        this.rememberVotedItems(
          this.selectedIds
            .map((id) => this.items.find((item) => item.id === id)?.title)
            .filter(Boolean),
        )
        this.screen = 'result'
        this.startPolling()
      } finally {
        this.submitting = false
      }
    },
    async refreshResult() {
      try {
        const payload = await getResult(this.token)
        this.phase = payload.phase
        // 3.13 不揭露時 result 為 null；此時要一併清掉，
        // 否則活動中途結束後，未投票者會繼續看到過期票數
        this.result = payload.disclosed ? payload.result : null
        if (!payload.disclosed) this.stopPolling()
      } catch {
        // 輪詢失敗不覆蓋畫面，下一輪再嘗試。
      }
    },
    startPolling() {
      this.stopPolling()
      if (this.activity?.result_visibility !== 'realtime' || this.phase !== 'ongoing' || !this.result) return
      this.pollTimer = window.setInterval(() => this.refreshResult(), POLLING_INTERVAL)
    },
    stopPolling() {
      if (this.pollTimer) window.clearInterval(this.pollTimer)
      this.pollTimer = null
    },
  },
})

export { POLLING_INTERVAL }
