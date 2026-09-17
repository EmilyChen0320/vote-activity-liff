<script setup>
defineProps({ result: { type: Object, required: true } })
</script>

<template>
  <div class="space-y-5">
    <article v-for="item in result.items || []" :key="item.id" class="flex gap-3">
      <img v-if="item.image" :src="item.image" alt="" class="h-[60px] w-[60px] shrink-0 rounded-lg object-cover">
      <div class="min-w-0 flex-1 py-1">
        <div class="flex justify-between gap-3 text-sm"><strong class="truncate text-heading">{{ item.title || '圖片選項' }}</strong><span>{{ Number(item.percentage || 0).toFixed(0) }}%</span></div>
        <div class="mt-2 h-2 overflow-hidden rounded-full bg-gray-200"><div class="h-full rounded-full bg-primary" :style="{ width: `${Math.min(Number(item.percentage || 0), 100)}%` }"></div></div>
      </div>
    </article>
    <p class="text-center text-sm text-muted">總票數 {{ Number(result.total_votes || 0).toLocaleString() }} 票</p>
  </div>
</template>
