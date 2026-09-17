<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import ResultList from '../components/ResultList.vue'
import VoteOption from '../components/VoteOption.vue'
import { useVoteActivityStore } from '../stores/voteActivity'

const store = useVoteActivityStore()
const submitError = ref('')
const statusContent = computed(() => {
  if (store.phase === 'scheduled' || store.viewer?.reason === 'not_started') return { title: '活動尚未開始', message: `開始時間：${store.activity?.start_at || '---'}` }
  if (store.phase === 'ended' || store.viewer?.reason === 'ended') return { title: '活動已結束', message: '感謝您對本次活動的關注' }
  if (store.viewer?.reason === 'frequency_limit_reached') return { title: '今日已完成投票', message: store.viewer.next_votable_at ? `下次可投時間：${store.viewer.next_votable_at}` : '您已達本活動的投票次數上限' }
  return null
})
const handleSubmit = async () => {
  submitError.value = ''
  try { await store.submit() } catch (error) { submitError.value = error.message || '投票失敗，請稍後再試' }
}
onMounted(() => store.bootstrap())
onBeforeUnmount(() => store.stopPolling())
</script>

<template>
  <main>
    <div v-if="store.loading" class="flex min-h-[70vh] items-center justify-center"><div class="h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div></div>
    <section v-else-if="store.error" class="p-4 pt-20 text-center">
      <h2 class="text-xl font-bold text-heading">{{ store.error.status === 404 ? '找不到活動' : '活動載入失敗' }}</h2><p class="mt-3 text-sm text-muted">{{ store.error.message }}</p><button type="button" class="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-white" @click="store.bootstrap">重新嘗試</button>
    </section>
    <template v-else-if="store.activity">
      <img v-if="store.activity.cover_image" :src="store.activity.cover_image" alt="活動主視覺" class="aspect-video w-full object-cover">
      <section class="p-4">
        <h2 class="text-xl font-bold text-heading">{{ store.activity.name }}</h2><p v-if="store.activity.description" class="mt-2 whitespace-pre-wrap text-sm leading-6 text-text">{{ store.activity.description }}</p>
        <div v-if="store.submitted" class="py-8 text-center"><img v-if="store.activity.result_cover_image" :src="store.activity.result_cover_image" alt="結果頁圖片" class="mb-6 aspect-video w-full rounded-xl object-cover"><h3 class="text-2xl font-bold text-heading">投票成功</h3><p class="mt-2 text-sm text-muted">{{ store.activity.completion_message || '感謝您的參與！' }}</p><div v-if="store.result" class="mt-8 text-left"><ResultList :result="store.result" /></div></div>
        <div v-else-if="statusContent" class="py-12 text-center"><h3 class="text-2xl font-bold text-heading">{{ statusContent.title }}</h3><p class="mt-2 text-sm text-muted">{{ statusContent.message }}</p><div v-if="store.result" class="mt-8 text-left"><ResultList :result="store.result" /></div></div>
        <div v-else-if="store.canVote" class="mt-6">
          <p class="mb-3 text-sm font-bold text-heading">請選擇一項<span v-if="store.activity.vote_mode === 'multiple'">（最多 {{ store.maxSelections }} 項）</span></p>
          <div class="space-y-3"><VoteOption v-for="item in store.votableItems" :key="item.id" :item="item" :selected="store.selectedIds.includes(item.id)" :disabled="store.submitting" @toggle="store.toggleSelection(item.id)" /></div>
          <label v-if="store.openTextItem" class="mt-6 block text-sm font-bold text-heading">{{ store.openTextItem.title }}<span v-if="store.openTextItem.required" class="text-red-500"> *</span><textarea v-model="store.answerText" maxlength="500" rows="4" class="mt-2 w-full rounded-xl border border-border p-3 font-normal outline-none focus:border-primary" :placeholder="store.openTextItem.subtitle || '請輸入內容'"></textarea><small class="block text-right font-normal text-muted">{{ store.answerText.length }}/500</small></label>
          <p v-if="submitError" class="mt-3 text-sm text-red-500">{{ submitError }}</p><button type="button" class="mt-6 w-full rounded-xl bg-primary py-3.5 font-bold text-white disabled:opacity-50" :disabled="store.submitting" @click="handleSubmit">{{ store.submitting ? '送出中…' : '確認投票' }}</button>
          <div v-if="store.result" class="mt-10"><h3 class="mb-5 text-lg font-bold text-heading">目前結果</h3><ResultList :result="store.result" /></div>
        </div>
      </section>
    </template>
  </main>
</template>
