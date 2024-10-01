import { createMemoryHistory, createRouter } from 'vue-router';

import SettingView from '@@/views/SettingView.vue';

const routes = [{ path: '/', component: SettingView }];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
