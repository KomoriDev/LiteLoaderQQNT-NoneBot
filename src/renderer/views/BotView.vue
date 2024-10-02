<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { BotConfig } from '@/types';
import { useRoute } from 'vue-router';
import ChevronLeft from '@@/components/icons/ChevronLeft.vue';
import { router } from '@@/router';

const route = useRoute();

const bot = ref<BotConfig>();

const getBot = async () => {
  await window.liteloader_nonebot.getBots().then((data) => (bot.value = data[Number(route.params.id as string)]));
};

onMounted(async () => {
  await getBot();
});
</script>

<template>
  <header class="header">
    <div class="flex gap-2 items-center">
      <button class="p-0.5 border rounded border-standard hover:opacity-75" @click="router.push({ name: 'home' })">
        <ChevronLeft class="w-3.5 h-3.5" />
      </button>
      <div class="header-title">{{ bot?.name }}</div>
    </div>
  </header>

  <setting-section data-title="概览">
    <setting-panel>
      <setting-list data-direction="row">
        <setting-item>
          <setting-text>Bot</setting-text>
          <setting-text data-type="secondary">{{ bot?.name }}</setting-text>
        </setting-item>
        <setting-item>
          <setting-text>Python</setting-text>
          <setting-text data-type="secondary">{{ bot?.python.version }}</setting-text>
        </setting-item>
      </setting-list>
    </setting-panel>
  </setting-section>
</template>

<style scoped>
.header {
  height: 40px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--fill_light_primary, var(--fg_white));
  margin-bottom: 20px;
  border-radius: 8px;
}
</style>
