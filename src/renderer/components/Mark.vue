<template>
  <span class="mark">
    <slot></slot>
  </span>
</template>

<style scoped>
.mark {
  color: inherit;
  background-color: transparent;

  animation-name: mark-highlight-animation;
  animation-duration: 1.5s;
  animation-delay: 0.5s;
  animation-fill-mode: forwards;

  background-size: 200%;
  background-position: 100% 0.4lh;
  background-repeat: no-repeat;
  background-image: linear-gradient(to right, #ffce0050 50%, transparent 50%);
}

@keyframes mark-highlight-animation {
  from {
    color: inherit;
    background-position: 100% var(--vp-nolebase-mark-bg-shift);
  }

  to {
    color: var(--vp-c-text-1);
    background-position: 0% var(--vp-nolebase-mark-bg-shift);
  }
}
</style>
