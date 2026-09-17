<script setup>
import { computed } from 'vue'

import CoverImage from '../components/CoverImage.vue'
import StatusCard from '../components/StatusCard.vue'
import { useVoteActivityStore } from '../stores/voteActivity'
import { formatDateTime } from '../utils/format'

const store = useVoteActivityStore()

defineEmits(['login'])

// 活動首頁只呈現狀態，不做時間推導：一律依 phase 與 viewer.reason
const statusCard = computed(() => {
  if (store.phase === 'scheduled' || store.viewer?.reason === 'not_started') {
    const startAt = formatDateTime(store.activity?.start_at)
    return { title: '活動尚未開始', message: startAt ? `${startAt} 開放投票` : '' }
  }

  if (store.phase === 'ended' || store.viewer?.reason === 'ended') {
    return { title: '活動已結束', message: '' }
  }

  if (store.viewer?.reason === 'frequency_limit_reached') {
    const nextAt = formatDateTime(store.viewer.next_votable_at)
    return {
      title: '今日已投過',
      message: nextAt ? `下次可投票時間：${nextAt}` : '您已達本活動的投票次數上限',
    }
  }

  return null
})

// 活動已結束時不再顯示「開始投票」，其餘狀態即使不能投也保留（停用）按鈕
const isEnded = computed(
  () => store.phase === 'ended' || store.viewer?.reason === 'ended',
)
const showVoteButton = computed(() => !isEnded.value)

// 已投過且「不能再投」時才顯示完成狀態；
// 不限次數的活動投完仍可再投，停在完成畫面會讓人以為不能投了
const showVotedSummary = computed(
  () => store.hasVoted && !store.canVote && store.phase !== 'scheduled' && !statusCard.value,
)
</script>

<template>
  <main class="pb-28">
    <CoverImage
      :image="store.activity.cover_image"
      :start-at="store.activity.start_at"
      :end-at="store.activity.end_at"
    />

    <section class="px-4 pt-4">
      <template v-if="showVotedSummary">
        <h2 class="text-center text-xl font-bold text-heading">✓ 已完成投票</h2>
        <p class="mt-1 text-center text-sm text-muted">感謝您的參與！目前即時結果：</p>
        <div
          v-if="store.votedItemTitles.length"
          class="mt-5 rounded-xl border border-primary/30 bg-primary-soft px-4 py-5 text-center text-sm text-primary"
        >
          您的投票：{{ store.votedItemTitles.join('、') }}
        </div>
        <button
          type="button"
          class="mt-5 w-full rounded-xl bg-primary py-3.5 font-bold text-white"
          @click="store.goToScreen('result')"
        >
          查看目前即時投票結果
        </button>
      </template>

      <template v-else>
        <h2 class="text-lg font-bold text-heading">{{ store.activity.name }}</h2>
        <p
          v-if="store.activity.description"
          class="mt-3 whitespace-pre-wrap text-sm leading-6 text-text"
        >
          {{ store.activity.description }}
        </p>

        <StatusCard
          v-if="statusCard"
          class="mt-6"
          :title="statusCard.title"
          :message="statusCard.message"
        />

        <button
          v-if="showVoteButton"
          type="button"
          class="mt-6 w-full rounded-xl py-3.5 font-bold"
          :class="store.canVote ? 'bg-primary text-white' : 'bg-gray-400 text-white'"
          :disabled="!store.canVote"
          @click="store.goToScreen('vote')"
        >
          開始投票
        </button>

        <p v-if="store.needsLogin" class="mt-3 text-center text-xs text-muted">
          🔒 需要 LINE 登入才能投票
        </p>

        <button
          v-if="store.hasVoted && store.result"
          type="button"
          class="mt-3 w-full text-center text-sm font-bold text-primary underline"
          @click="store.goToScreen('result')"
        >
          查看目前即時投票結果
        </button>
      </template>
    </section>

    <div v-if="store.needsLogin" class="fixed inset-x-0 bottom-0 mx-auto max-w-[393px] p-4">
      <p v-if="store.loginError" class="mb-2 text-center text-xs text-red-500">
        {{ store.loginError }}
      </p>
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#06c755] py-3.5 font-bold text-white"
        @click="$emit('login')"
      >
        使用 LINE 登入
      </button>
    </div>
  </main>
</template>
