<script setup>
import AppNavBar from './components/layout/AppNavBar.vue'
</script>

<template>
  <div class="mx-auto min-h-screen w-full max-w-[393px] bg-page text-text">
    <AppNavBar title="投票活動" />
    <router-view />
  </div>
</template>
