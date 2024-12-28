<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import type { Driver } from '@/types/driver';
import { Button } from '@@/components/ui/button';
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
import { Skeleton } from '@@/components/ui/skeleton';
import Card from './Card.vue';

const drivers = ref<Driver[]>([]);
const isLoading = ref<boolean>(drivers.value === null);

const currentPage = ref(1);
const itemsPerPage = 12;

const fetchDrivers = async () => {
  isLoading.value = true;
  try {
    drivers.value = await window.liteloader_nonebot.fetchRegistryData('driver');
    currentPage.value = 1;
  } catch (error) {
    console.error('Failed to fetch drivers:', error);
  }
};

const paginatedDrivers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return drivers.value?.slice(start, end);
});

watch(
  () => drivers.value,
  (newValue) => {
    if (newValue && newValue.length > 0) {
      isLoading.value = false;
    }
  }
);

onMounted(async () => {
  await fetchDrivers();
});
</script>

<template>
  <setting-section :data-title="`驱动器列表(共收录 ${drivers.length} 个驱动器)`">
    <div v-if="isLoading" class="grid grid-cols-2 gap-5 lg:grid-cols-3">
      <div v-for="index in 6" :key="index">
        <Skeleton class="w-full h-32 rounded-xl" />
      </div>
    </div>
    <Pagination
      v-else
      v-slot="{ page }"
      v-model:page="currentPage"
      :total="drivers.length"
      :items-per-page="12"
      :sibling-count="1"
      show-edges
    >
      <div class="grid grid-cols-2 gap-5 lg:grid-cols-3">
        <div v-for="(driver, index) in paginatedDrivers" :key="index">
          <Card :resource="driver" />
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
