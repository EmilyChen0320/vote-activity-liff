<script setup>
import ResultList from './ResultList.vue'

defineProps({
  title: { type: String, required: true },
  message: { type: String, default: '' },
  result: { type: Object, default: null },
})
</script>

<template>
  <div class="py-12 text-center">
    <h3 class="text-2xl font-bold text-heading">{{ title }}</h3>
    <p v-if="message" class="mt-2 text-sm text-muted">{{ message }}</p>
    <div v-if="result" class="mt-8 text-left">
      <ResultList :result="result" />
    </div>
  </div>
</template>
