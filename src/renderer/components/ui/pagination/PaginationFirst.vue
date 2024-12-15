<script setup lang="ts">
import { ChevronsLeft } from 'lucide-vue-next';
import { PaginationFirst, type PaginationFirstProps } from 'radix-vue';
import { computed, type HTMLAttributes } from 'vue';

import { cn } from '@@/lib/utils';
import { Button } from '@@/components/ui/button';

const props = withDefaults(defineProps<PaginationFirstProps & { class?: HTMLAttributes['class'] }>(), {
  asChild: true,
});

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <PaginationFirst v-bind="delegatedProps">
    <Button :class="cn('w-8 h-8 p-0', props.class)" variant="secondary" size="icon">
      <slot>
        <ChevronsLeft class="h-4 w-4" />
      </slot>
    </Button>
  </PaginationFirst>
</template>
