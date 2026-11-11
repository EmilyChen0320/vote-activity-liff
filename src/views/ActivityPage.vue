<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'

import AppNavBar from '../components/layout/AppNavBar.vue'
import { useVoteActivityStore } from '../stores/voteActivity'
import { getActivityErrorView } from '../utils/activityError'
import HomeView from './HomeView.vue'
import ResultView from './ResultView.vue'
import VoteView from './VoteView.vue'

const store = useVoteActivityStore()

const screens = { home: HomeView, vote: VoteView, result: ResultView }
const currentScreen = computed(() => screens[store.screen] ?? HomeView)
const navTitle = computed(() => store.activity?.name || '投票活動')
const errorView = computed(() => getActivityErrorView(store.error))

const handleVisibilityChange = () => store.handleVisibilityChange()

onMounted(() => {
  store.bootstrap()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  store.stopPolling()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <AppNavBar
      :title="navTitle"
      :show-back="store.screen !== 'home'"
      @back="store.goToScreen('home')"
      @close="store.requestClose"
    />

    <div v-if="store.loading" class="flex min-h-[70vh] items-center justify-center">
      <div
        class="h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
      ></div>
    </div>

    <section v-else-if="store.error" class="p-4 pt-20 text-center">
      <h2 class="text-xl font-bold text-heading">{{ errorView.title }}</h2>
      <p class="mt-3 text-sm text-muted">{{ errorView.message }}</p>
      <button
        v-if="errorView.canRetry"
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
