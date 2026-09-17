<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import ActivityHero from '../components/ActivityHero.vue'
import CompletedPanel from '../components/CompletedPanel.vue'
import StatusPanel from '../components/StatusPanel.vue'
import VoteForm from '../components/VoteForm.vue'
import { useVoteActivityStore } from '../stores/voteActivity'
import { formatDateTime } from '../utils/format'

const store = useVoteActivityStore()
const submitError = ref('')
const submitRetryable = ref(false)

// 畫面分流一律依 phase 與 viewer.reason，不可用手機時間推導
const statusContent = computed(() => {
  if (store.phase === 'scheduled' || store.viewer?.reason === 'not_started') {
    const startAt = formatDateTime(store.activity?.start_at)
    return {
      title: '活動尚未開始',
      message: startAt ? `開始時間：${startAt}` : '請稍後再回來參與',
    }
  }

  if (store.phase === 'ended' || store.viewer?.reason === 'ended') {
    return { title: '活動已結束', message: '感謝您對本次活動的關注' }
  }

  if (store.viewer?.reason === 'frequency_limit_reached') {
    const nextAt = formatDateTime(store.viewer.next_votable_at)
    return {
      title: '已完成本次投票',
      message: nextAt ? `下次可投時間：${nextAt}` : '您已達本活動的投票次數上限',
    }
  }

  if (store.viewer?.reason === 'login_required') {
    return { title: '需要 LINE 登入', message: '請從 LINE 開啟此活動連結後再參與投票' }
  }

  // 兜底：後端若回了預期外的狀態，也要有畫面，不能整頁空白
  if (!store.canVote) {
    return { title: '目前無法投票', message: '請稍後再試，或從 LINE 重新開啟活動連結' }
  }

  return null
})

const handleSubmit = async () => {
  submitError.value = ''
  submitRetryable.value = false

  try {
    await store.submit()
  } catch (error) {
    // 429 VOTE_SUBMISSION_IN_PROGRESS 代表上一次送出還在處理，屬於可重試，不當成錯誤畫面
    submitRetryable.value = error?.code === 'VOTE_SUBMISSION_IN_PROGRESS'
    submitError.value = submitRetryable.value
      ? '上一次投票還在處理中，請稍候再送出一次'
      : error.message || '投票失敗，請稍後再試'
  }
}

onMounted(() => store.bootstrap())
onBeforeUnmount(() => store.stopPolling())
</script>

<template>
  <main>
    <div v-if="store.loading" class="flex min-h-[70vh] items-center justify-center">
      <div
        class="h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
      ></div>
    </div>

    <section v-else-if="store.error" class="p-4 pt-20 text-center">
      <h2 class="text-xl font-bold text-heading">
        {{ store.error.status === 404 ? '找不到活動' : '活動載入失敗' }}
      </h2>
      <p class="mt-3 text-sm text-muted">{{ store.error.message }}</p>
      <button
        type="button"
        class="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-white"
        @click="store.bootstrap"
      >
        重新嘗試
      </button>
    </section>

    <template v-else-if="store.activity">
      <ActivityHero :activity="store.activity" />

      <section class="p-4">
        <CompletedPanel
          v-if="store.submitted"
          :activity="store.activity"
          :result="store.result"
        />

        <StatusPanel
          v-else-if="statusContent"
          :title="statusContent.title"
          :message="statusContent.message"
          :result="store.result"
        />

        <VoteForm
          v-else
          :store="store"
          :error-message="submitError"
          :error-retryable="submitRetryable"
          @submit="handleSubmit"
        />
      </section>
    </template>
  </main>
</template>
