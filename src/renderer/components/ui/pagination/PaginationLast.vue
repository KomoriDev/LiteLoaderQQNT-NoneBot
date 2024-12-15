<script setup lang="ts">
import { ChevronsRight } from 'lucide-vue-next';
import { PaginationLast, type PaginationLastProps } from 'radix-vue';
import { computed, type HTMLAttributes } from 'vue';

import { cn } from '@@/lib/utils';
import { Button } from '@@/components/ui/button';

const props = withDefaults(defineProps<PaginationLastProps & { class?: HTMLAttributes['class'] }>(), {
  asChild: true,
});

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <PaginationLast v-bind="delegatedProps">
    <Button :class="cn('w-8 h-8 p-0', props.class)" variant="secondary" size="icon">
      <slot>
        <ChevronsRight class="h-4 w-4" />
      </slot>
    </Button>
  </PaginationLast>
</template>
