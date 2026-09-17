<script setup>
import CoverImage from '../components/CoverImage.vue'
import ResultList from '../components/ResultList.vue'
import { closeLiffWindow } from '../services/liff'
import { useVoteActivityStore } from '../stores/voteActivity'

const store = useVoteActivityStore()
</script>

<template>
  <main class="pb-6">
    <!-- 沒設定結果頁圖片時退回預設圖，不讓畫面開天窗 -->
    <CoverImage
      :image="store.activity.result_cover_image"
      :start-at="store.activity.start_at"
      :end-at="store.activity.end_at"
      use-default
    />

    <section class="px-4 pt-5 text-center">
      <h2 class="text-xl font-bold text-heading">
        ✓ {{ store.submitted ? '投票成功' : '已完成投票' }}
      </h2>
      <p class="mt-1 text-sm text-muted">
        {{ store.activity.completion_message || '感謝您的參與！' }}<span v-if="store.result">目前即時結果：</span>
      </p>

      <div v-if="store.result" class="mt-6 text-left">
        <ResultList :result="store.result" />
      </div>

      <button
        type="button"
        class="mt-8 w-full rounded-xl bg-primary py-3.5 font-bold text-white"
        @click="closeLiffWindow"
      >
        關閉
      </button>
    </section>
  </main>
</template>
