window.$ = window.jQuery = require('jquery');

import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap';

import App from './App.vue';
import router from './router';
import store from './store';

import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/css/style.css"
import "./assets/css/custom.css"
import 'vue-json-pretty/lib/styles.css';

const app = createApp(App);

app.config.globalProperties.$API_URL = process.env.VUE_APP_AZTEC_API_URL;
app.config.globalProperties.SITE_URI = process.env.VUE_APP_AZTEC_SITE_URI;

app.use(VueAxios, axios.create({
    baseURL: app.config.globalProperties.$API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.token
    }
}));

app.use(router);
app.use(store);

router.onError((error, to, from) => {
    const targetPath = to.fullPath;
    if (error.name === 'ChunkLoadError') {
        console.warn(`Chunk load failed for route: ${targetPath}. Reloading page...`);
        window.location.reload();
    }
});

app.mount('#app');

// Axios interceptors remain the same as they are attached to the axios instance or Vue.axios which we configured.
// However, since we used app.use(VueAxios, ...), we should check if we need to access it via app.config.globalProperties.axios or just import axios.
// The original code used Vue.axios.interceptors. Since we imported axios, we can use it directly.

axios.interceptors.request.use((config) => {
    let token                    = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}, function(error) {
    return Promise.reject(error)
});

axios.interceptors.response.use((res) => {
    return res;
}, function(error) {
    if(error.response && error.response.status === 401) {
        window.location.href = "/auth/login";
        console.log(error.response.status);
    }
    return Promise.reject(error)
});
