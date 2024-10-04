<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronLeft } from 'lucide-vue-next';

import { router } from '@@/router';
import { BotConfig } from '@/types';
import { Button } from '@@/components/ui/button';

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
      <Button variant="secondary" size="icon" @click="router.push({ name: 'home' })">
        <ChevronLeft class="w-3 h-3" />
      </Button>
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

  <setting-section data-title="管理">
    <setting-panel>
      <setting-list data-direction="column">
        <setting-item>
          <setting-text>进程</setting-text>
          <Button variant="primary">启动</Button>
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
