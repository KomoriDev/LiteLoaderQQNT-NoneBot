import { createApp } from 'vue';
import { router } from './router';
import App from './App.vue';

import './index.css';

export const onSettingWindowCreated = async (view: HTMLElement) => {
  const app = createApp(App);
  app.use(router);
  app.mount(view);
};
