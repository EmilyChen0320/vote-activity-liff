<script setup>
import ResultList from './ResultList.vue'
import VoteOption from './VoteOption.vue'

defineProps({
  store: { type: Object, required: true },
  errorMessage: { type: String, default: '' },
  errorRetryable: Boolean,
})

defineEmits(['submit'])
</script>

<template>
  <div class="mt-6">
    <p class="mb-3 text-sm font-bold text-heading">
      請選擇一項
      <span v-if="store.activity.vote_mode === 'multiple'">
        （最多 {{ store.maxSelections }} 項）
      </span>
    </p>

    <div class="space-y-3">
      <VoteOption
        v-for="item in store.votableItems"
        :key="item.id"
        :item="item"
        :selected="store.selectedIds.includes(item.id)"
        :disabled="store.submitting"
        @toggle="store.toggleSelection(item.id)"
      />
    </div>

    <label v-if="store.openTextItem" class="mt-6 block text-sm font-bold text-heading">
      {{ store.openTextItem.title }}
      <span v-if="store.openTextItem.required" class="text-red-500"> *</span>
      <textarea
        v-model="store.answerText"
        maxlength="500"
        rows="4"
        class="mt-2 w-full rounded-xl border border-border p-3 font-normal outline-none focus:border-primary"
        :placeholder="store.openTextItem.subtitle || '請輸入內容'"
      ></textarea>
      <small class="block text-right font-normal text-muted">
        {{ store.answerText.length }}/500
      </small>
    </label>

    <p
      v-if="errorMessage"
      class="mt-3 text-sm"
      :class="errorRetryable ? 'text-muted' : 'text-red-500'"
    >
      {{ errorMessage }}
    </p>

    <button
      type="button"
      class="mt-6 w-full rounded-xl bg-primary py-3.5 font-bold text-white disabled:opacity-50"
      :disabled="store.submitting"
      @click="$emit('submit')"
    >
      {{ store.submitting ? '送出中…' : '確認投票' }}
    </button>

    <div v-if="store.result" class="mt-10">
      <h3 class="mb-5 text-lg font-bold text-heading">目前結果</h3>
      <ResultList :result="store.result" />
    </div>
  </div>
</template>
