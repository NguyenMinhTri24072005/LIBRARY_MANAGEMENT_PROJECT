import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import router from './router';

// Import CSS toàn cục
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css'; // File CSS custom của bạn

import App from './App.vue';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import JS của Bootstrap

const app = createApp(App);

// Thiết lập Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);

app.mount('#app');