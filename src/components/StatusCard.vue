<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, default: '' },
})
</script>

<template>
  <div class="rounded-xl border border-primary/30 bg-primary-soft px-4 py-5 text-center">
    <p class="text-base font-bold text-primary">{{ title }}</p>
    <p v-if="message" class="mt-1 text-sm text-muted">{{ message }}</p>
  </div>
</template>
