<script setup>
defineProps({
  activity: { type: Object, required: true },
})
</script>

<template>
  <div>
    <img
      v-if="activity.cover_image"
      :src="activity.cover_image"
      alt="活動主視覺"
      class="aspect-video w-full object-cover"
    >
    <div class="px-4 pt-4">
      <h2 class="text-xl font-bold text-heading">{{ activity.name }}</h2>
      <p
        v-if="activity.description"
        class="mt-2 whitespace-pre-wrap text-sm leading-6 text-text"
      >
        {{ activity.description }}
      </p>
    </div>
  </div>
</template>
