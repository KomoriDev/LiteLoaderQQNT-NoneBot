import { createMemoryHistory, createRouter } from 'vue-router';

import BotView from '@@/views/BotView.vue';
import SettingView from '@@/views/SettingView.vue';

const routes = [
  { path: '/', name: 'home', component: SettingView },
  { path: '/bot/:id', component: BotView },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
