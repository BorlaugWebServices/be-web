window.$ = window.jQuery = require('jquery');

import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import CurrencyFormatter from 'currency-formatter';
import moment from "moment";
import {BigNumber} from "bignumber.js";
import 'bootstrap'

import App from './App.vue';
import router from './router';
import store from './store';

import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/css/style.css"
import "./assets/css/custom.css"

Vue.config.productionTip = false;

Vue.prototype.$API_URL    = process.env.VUE_APP_API_URL;
Vue.prototype.SITE_URI    = process.env.VUE_APP_SITE_URI;

Vue.use(VueAxios, axios.create({
    baseURL: Vue.prototype.$API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.token
    }
}));


Vue.filter('currency', function(value, symbol) {
    value = value.toString();
    return CurrencyFormatter.format(new BigNumber(value).toString(), {symbol: symbol || '$ '});
});
Vue.filter('count', function(value) {
    if(!value) return '';
    return new BigNumber(value).toFormat(2);
});
Vue.filter('fromNow', function(dateString) {
    if(!dateString) return '';
    if(dateString.length > 10) {
        dateString = dateString.substr(0,10);
    }
    return moment.unix(dateString).fromNow();
});
Vue.filter('date', function(dateString) {
    if(!dateString) return '';
    if(dateString.length > 10) {
        dateString = dateString.substr(0,10);
    }
    return moment.unix(dateString).format("MMMM Do YYYY");
});
Vue.filter('timestamp', function(dateString) {

    if(!dateString) return '';
    if(dateString.length > 10) {
        dateString = dateString.substr(0,10);
    }
    return moment.unix(dateString).format("MMMM Do YYYY, h:mm:ss a");
});
Vue.filter('capitalize', function(value) {
    if(!value) return '';
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
});
Vue.filter('lowercase', function(value) {
    if(!value) return '';
    value = value.toString();
    return value.toLowerCase()
});
Vue.filter('truncate', function(text, length, suffix) {
    if(text.length <= length) return text;
    return text.substring(0, length) + suffix;
});
Vue.filter('did', function (didString) {
    if (!didString) {
        return '';
    }
    return 'did:bws:' + didString.substring(2, didString.length - 2);
});


Vue.axios.interceptors.request.use((config) => {
    let token                    = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}, function(error) {
    return Promise.reject(error)
});

Vue.axios.interceptors.response.use((res) => {
    return res;
}, function(error) {
    if(error.response && error.response.status === 401) {
        window.location.href = "/auth/login";
        console.log(error.response.status);
    }
    return Promise.reject(error)
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
