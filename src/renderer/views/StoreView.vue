<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronLeft } from 'lucide-vue-next';

import { router } from '@@/router';
import { BotConfig } from '@/types/config';
import { Button } from '@@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@@/components/ui/tabs';

import {
  Plugin as PluginPageContent,
  Driver as DriverPageContent,
  Adapter as AdapterPageContent,
} from '@@/components/store';

const route = useRoute();
const bot = ref<BotConfig>();

const getBot = async () => {
  const data = await window.liteloader_nonebot.getBots();
  bot.value = data[Number(route.params.id as string)];
};

onMounted(async () => {
  await getBot();
});
</script>

<template>
  <header class="header">
    <nav class="flex gap-2 items-center">
      <Button variant="secondary" size="icon" @click="router.push(`/bot/${route.params.id}`)">
        <ChevronLeft class="w-3 h-3" />
      </Button>
      <p>商店</p>
    </nav>
    <nav class="flex gap-2 items-center">
      <p class="text-[--text_secondary]">当前 Bot: {{ bot?.name }}</p>
    </nav>
  </header>

  <Tabs default-value="plugin">
    <setting-section data-title="筛选">
      <setting-panel>
        <setting-list data-direction="column ">
          <setting-item class="p-2.5 flex items-center justify-between">
            <setting-text>类型</setting-text>
            <TabsList class="grid w-[210px] grid-cols-3">
              <TabsTrigger value="plugin">插件</TabsTrigger>
              <TabsTrigger value="adapter">适配器</TabsTrigger>
              <TabsTrigger value="driver">驱动器</TabsTrigger>
            </TabsList>
          </setting-item>
        </setting-list>
      </setting-panel>
    </setting-section>

    <TabsContent value="plugin">
      <PluginPageContent />
    </TabsContent>

    <TabsContent value="adapter">
      <AdapterPageContent />
    </TabsContent>

    <TabsContent value="driver">
      <DriverPageContent />
    </TabsContent>
  </Tabs>
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
