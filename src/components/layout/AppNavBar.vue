<script setup>
import { closeLiffWindow } from '../../services/liff'

defineProps({ title: { type: String, default: '請投票' } })
</script>

<template>
  <header class="sticky top-0 z-20 flex h-12 items-center justify-between bg-primary px-4 text-white">
    <span class="w-6"></span>
    <h1 class="text-sm font-bold">{{ title }}</h1>
    <button type="button" class="h-8 w-8 text-xl" aria-label="關閉" @click="closeLiffWindow">×</button>
  </header>
</template>
