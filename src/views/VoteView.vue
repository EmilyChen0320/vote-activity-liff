<script setup>
import { ref } from 'vue'

import CoverImage from '../components/CoverImage.vue'
import VoteOption from '../components/VoteOption.vue'
import { useVoteActivityStore } from '../stores/voteActivity'
import { countCharacters } from '../utils/format'

const store = useVoteActivityStore()
const submitError = ref('')
const submitRetryable = ref(false)

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
</script>

<template>
  <main class="pb-6">
    <CoverImage
      :image="store.activity.cover_image"
      :start-at="store.activity.start_at"
      :end-at="store.activity.end_at"
    />

    <section class="px-4 pt-4">
      <p class="text-base font-bold text-heading">
        {{ store.activity.vote_mode === 'multiple'
          ? `請選擇最多 ${store.maxSelections} 項（複選）`
          : '請選擇一項（單選）' }}
      </p>

      <div class="mt-4 space-y-3">
        <VoteOption
          v-for="item in store.votableItems"
          :key="item.id"
          :item="item"
          :selected="store.selectedIds.includes(item.id)"
          :disabled="store.submitting"
          @toggle="store.toggleSelection(item.id)"
        />
      </div>

      <div v-if="store.openTextItem" class="mt-6">
        <p class="text-sm font-bold text-heading">
          {{ store.openTextItem.title }}
          <span class="font-normal text-muted">
            ({{ store.openTextItem.required ? '必填' : '選填' }})
          </span>
        </p>
        <p v-if="store.openTextItem.subtitle" class="mt-1 text-xs text-muted">
          {{ store.openTextItem.subtitle }}
        </p>
        <textarea
          v-model="store.answerText"
          rows="4"
          class="mt-2 w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-primary"
          placeholder="留下想對節目說的話..."
        ></textarea>
        <small class="block text-right text-xs text-muted">
          {{ countCharacters(store.answerText) }}/500
        </small>
      </div>

      <p
        v-if="submitError"
        class="mt-3 text-sm"
        :class="submitRetryable ? 'text-muted' : 'text-red-500'"
      >
        {{ submitError }}
      </p>

      <button
        type="button"
        class="mt-6 w-full rounded-xl bg-primary py-3.5 font-bold text-white disabled:opacity-50"
        :disabled="store.submitting"
        @click="handleSubmit"
      >
        {{ store.submitting ? '送出中…' : '送出投票' }}
      </button>
    </section>
  </main>
</template>
