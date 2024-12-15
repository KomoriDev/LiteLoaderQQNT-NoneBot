import { createMemoryHistory, createRouter } from 'vue-router';

import BotView from '@@/views/BotView.vue';
import SettingView from '@@/views/SettingView.vue';
import StoreView from '@@/views/StoreView.vue';

const routes = [
  { path: '/', name: 'home', component: SettingView },
  { path: '/bot/:id', component: BotView },
  { path: '/store/:id', component: StoreView },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
