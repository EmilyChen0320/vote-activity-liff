<script setup>
import { closeLiffWindow } from '../../services/liff'

defineProps({
  title: { type: String, default: '投票活動' },
  showBack: Boolean,
})

defineEmits(['back'])
</script>

<template>
  <header class="sticky top-0 z-20 flex h-12 items-center justify-between bg-primary px-3 text-white">
    <button
      v-if="showBack"
      type="button"
      class="h-8 w-8 text-lg"
      aria-label="返回"
      @click="$emit('back')"
    >
      &lsaquo;
    </button>
    <span v-else class="w-8"></span>

    <h1 class="truncate px-2 text-sm font-bold">{{ title }}</h1>

    <button type="button" class="h-8 w-8 text-xl" aria-label="關閉" @click="closeLiffWindow">
      &times;
    </button>
  </header>
</template>
