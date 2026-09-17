<script setup>
defineProps({
  item: { type: Object, required: true },
  selected: Boolean,
  disabled: Boolean,
})

defineEmits(['toggle'])
</script>

<template>
  <button
    type="button"
    class="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition"
    :class="selected ? 'border-primary bg-primary-soft' : 'border-border bg-white'"
    :disabled="disabled"
    @click="$emit('toggle')"
  >
    <span
      class="flex h-5 w-5 shrink-0 items-center justify-center rounded border"
      :class="selected ? 'border-primary bg-primary text-white' : 'border-gray-300'"
    >
      <span v-if="selected">✓</span>
    </span>

    <img
      v-if="item.image"
      :src="item.image"
      alt=""
      class="h-16 w-16 shrink-0 rounded-lg object-cover"
    >

    <span class="min-w-0">
      <strong v-if="item.title" class="block text-sm text-heading">{{ item.title }}</strong>
      <small v-if="item.subtitle" class="mt-1 block text-xs leading-5 text-muted">
        {{ item.subtitle }}
      </small>
    </span>
  </button>
</template>
