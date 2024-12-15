<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronLeft } from 'lucide-vue-next';

import { router } from '@@/router';
import { BotConfig, PluginsResponse } from '@/types';
import { Button } from '@@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@@/components/ui/tabs';
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@@/components/ui/pagination';
import Skeleton from '../components/ui/skeleton/Skeleton.vue';
import PluginCard from '../components/PluginCard.vue';

const route = useRoute();
const bot = ref<BotConfig>();
const isLoading = ref<boolean>(false);

const plugins = ref<PluginsResponse>([]);
const currentPage = ref(1);
const itemsPerPage = 12;

const getBot = async () => {
  const data = await window.liteloader_nonebot.getBots();
  bot.value = data[Number(route.params.id as string)];
};

const fetchPlugins = async () => {
  isLoading.value = true;
  try {
    plugins.value = await window.liteloader_nonebot.fetchPlugins();
    currentPage.value = 1;
  } catch (error) {
    console.error('Failed to fetch plugins:', error);
  }
};

const paginatedPlugins = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return plugins.value?.slice(start, end);
});

const totalPages = computed(() => Math.ceil(plugins.value?.length / itemsPerPage));

watch(
  () => plugins.value,
  (newValue) => {
    if (newValue && newValue.length > 0) {
      isLoading.value = false;
    }
  }
);

onMounted(async () => {
  await getBot();
  await fetchPlugins();
});
</script>

<template>
  <header class="header">
    <nav class="flex gap-2 items-center">
      <Button variant="secondary" size="icon" @click="router.push(`/bot/${route.params.id}`)">
        <ChevronLeft class="w-3 h-3" />
      </Button>
      <p>插件商店</p>
    </nav>
    <nav class="flex gap-2 items-center">
      <p class="text-[--text_secondary]">当前 Bot: {{ bot?.name }}</p>
    </nav>
  </header>

  <setting-section data-title="筛选">
    <setting-panel>
      <setting-list data-direction="column ">
        <setting-item class="p-2.5 flex items-center justify-between">
          <setting-text>类型</setting-text>
          <Tabs default-value="plugin" class="w-[210px]">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger value="plugin">插件</TabsTrigger>
              <TabsTrigger value="adapter">适配器</TabsTrigger>
              <TabsTrigger value="driver">驱动器</TabsTrigger>
            </TabsList>
          </Tabs>
        </setting-item>
      </setting-list>
    </setting-panel>
  </setting-section>

  <setting-section :data-title="`插件列表(共收录 ${plugins.length} 个插件)`">
    <div v-if="isLoading" class="grid grid-cols-2 gap-5 lg:grid-cols-3">
      <div v-for="index in 6" :key="index">
        <Skeleton class="w-full h-32 rounded-xl" />
      </div>
    </div>
    <Pagination v-else v-slot="{ page }" v-model:page="currentPage" :total="totalPages" :sibling-count="3" show-edges>
      <div class="grid grid-cols-2 gap-5 lg:grid-cols-3">
        <div v-for="(plugin, index) in paginatedPlugins" :key="index">
          <PluginCard :plugin="plugin" />
        </div>
      </div>

      <PaginationList v-slot="{ items }" class="flex items-center justify-center gap-1 my-5">
        <PaginationFirst />
        <PaginationPrev />

        <template v-for="(item, index) in items">
          <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
            <Button class="w-8 h-8 p-0" :variant="item.value === page ? 'primary' : 'secondary'" size="icon">
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext />
        <PaginationLast />
      </PaginationList>
    </Pagination>
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
