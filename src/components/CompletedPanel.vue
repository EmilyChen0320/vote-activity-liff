<script setup>
import ResultList from './ResultList.vue'

defineProps({
  activity: { type: Object, required: true },
  result: { type: Object, default: null },
})
</script>

<template>
  <div class="py-8 text-center">
    <img
      v-if="activity.result_cover_image"
      :src="activity.result_cover_image"
      alt="結果頁圖片"
      class="mb-6 aspect-video w-full rounded-xl object-cover"
    >
    <h3 class="text-2xl font-bold text-heading">投票成功</h3>
    <p class="mt-2 text-sm text-muted">
      {{ activity.completion_message || '感謝您的參與！' }}
    </p>
    <div v-if="result" class="mt-8 text-left">
      <ResultList :result="result" />
    </div>
  </div>
</template>
