<script setup>
defineProps({
  result: { type: Object, required: true },
})

const toPercentage = (value) => Number(value || 0)
</script>

<template>
  <div>
    <article
      v-for="item in result.items || []"
      :key="item.id"
      class="mb-4 flex items-center gap-3"
    >
      <img
        v-if="item.image"
        :src="item.image"
        alt=""
        class="h-12 w-12 shrink-0 rounded-lg object-cover"
      >
      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between gap-3 text-sm">
          <span class="truncate text-heading">{{ item.title }}</span>
          <span class="shrink-0 text-heading">{{ toPercentage(item.percentage).toFixed(0) }}%</span>
        </div>
        <div class="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            class="h-full rounded-full bg-primary"
            :style="{ width: `${Math.min(toPercentage(item.percentage), 100)}%` }"
          ></div>
        </div>
      </div>
    </article>

    <p class="mt-6 text-center text-sm text-heading">
      總票數：{{ Number(result.total_votes || 0).toLocaleString() }}
    </p>
  </div>
</template>
