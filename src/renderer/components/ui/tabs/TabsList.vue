<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { TabsList, type TabsListProps } from 'radix-vue';

import { cn } from '@@/lib/utils';

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <TabsList
    v-bind="delegatedProps"
    :class="
      cn(
        'inline-flex items-center justify-center rounded-md bg-[--fill_standard_secondary] p-1 text-[--text_secondary]',
        props.class
      )
    "
  >
    <slot />
  </TabsList>
</template>
