import { defineStore } from 'pinia'

import { getActivity, getResult, submitVote } from '../api/voteActivity.js'
import { getLiffToken } from '../services/liff.js'

const POLLING_INTERVAL = 5000

export const useVoteActivityStore = defineStore('voteActivity', {
  state: () => ({
    loading: false, submitting: false, error: null, token: '', activity: null,
    items: [], phase: '', viewer: null, result: null, submitted: false,
    selectedIds: [], answerText: '', pollTimer: null,
  }),
  getters: {
    votableItems: (state) => state.items.filter((item) => item.type !== 'open_text'),
    openTextItem: (state) => state.items.find((item) => item.type === 'open_text') ?? null,
    canVote: (state) => state.phase === 'ongoing' && state.viewer?.can_vote === true,
    maxSelections: (state) => state.activity?.vote_mode === 'multiple' ? Number(state.activity.max_selections) || 1 : 1,
  },
  actions: {
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
        let payload = await getActivity()
        if (payload.viewer?.reason === 'login_required') {
          const token = await getLiffToken()
          if (!token) return
          this.token = token
          payload = await getActivity(token)
        }
        this.applyActivity(payload)
        this.startPolling()
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
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
      if (this.answerText.length > 500) return '開放輸入內容不可超過 500 字'
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
        this.startPolling()
      } finally {
        this.submitting = false
      }
    },
    async refreshResult() {
      try {
        const payload = await getResult(this.token)
        this.phase = payload.phase
        if (payload.disclosed) this.result = payload.result
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
