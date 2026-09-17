<script setup>
import { computed } from 'vue'

import defaultBanner from '../assets/images/result-banner-default.webp'
import { formatDateRange } from '../utils/format'

const props = defineProps({
  image: { type: String, default: '' },
  startAt: { type: String, default: '' },
  endAt: { type: String, default: '' },
  /** 沒有圖片時是否退回預設圖（結果頁用） */
  useDefault: Boolean,
})

const source = computed(() => props.image || (props.useDefault ? defaultBanner : ''))
const period = computed(() => formatDateRange(props.startAt, props.endAt))
</script>

<template>
  <div v-if="source" class="relative">
    <img :src="source" alt="活動主視覺" class="aspect-video w-full object-cover">
    <span
      v-if="period"
      class="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-black/55 px-2.5 py-1 text-xs text-white"
    >
      <span aria-hidden="true">🗓</span>
      {{ period }}
    </span>
  </div>
</template>
