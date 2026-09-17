<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'

import AppNavBar from '../components/layout/AppNavBar.vue'
import { getEndpoint } from '../config/endpoint'
import { useVoteActivityStore } from '../stores/voteActivity'
import HomeView from './HomeView.vue'
import ResultView from './ResultView.vue'
import VoteView from './VoteView.vue'

const store = useVoteActivityStore()

const screens = { home: HomeView, vote: VoteView, result: ResultView }
const currentScreen = computed(() => screens[store.screen] ?? HomeView)
// 設計稿的導覽列顯示的是官方帳號／節目名稱，比活動名稱短，
// 由頁面外殼提供；沒有提供時退回活動名稱以免留白
const navTitle = computed(
  () => getEndpoint().oaName || store.activity?.name || '投票活動',
)

onMounted(() => store.bootstrap())
onBeforeUnmount(() => store.stopPolling())
</script>

<template>
  <div class="min-h-screen bg-white">
    <AppNavBar
      :title="navTitle"
      :show-back="store.screen !== 'home'"
      @back="store.goToScreen('home')"
    />

    <div v-if="store.loading" class="flex min-h-[70vh] items-center justify-center">
      <div
        class="h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
      ></div>
    </div>

    <section v-else-if="store.error" class="p-4 pt-20 text-center">
      <h2 class="text-xl font-bold text-heading">
        {{ store.error.status === 404 ? '找不到活動' : '活動載入失敗' }}
      </h2>
      <p class="mt-3 text-sm text-muted">{{ store.error.message }}</p>
      <button
        type="button"
        class="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-white"
        @click="store.bootstrap"
      >
        重新嘗試
      </button>
    </section>

    <component :is="currentScreen" v-else-if="store.activity" @login="store.login" />
  </div>
</template>
