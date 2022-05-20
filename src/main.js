window.$ = window.jQuery = require('jquery');

import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import CurrencyFormatter from 'currency-formatter';
import moment from "moment";
import {BigNumber} from "bignumber.js";
import 'bootstrap';
import {isHex, hexToString} from '@polkadot/util';

import App from './App.vue';
import router from './router';
import store from './store';

import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/css/style.css"
import "./assets/css/custom.css"

Vue.config.productionTip = false;

Vue.prototype.$API_URL = process.env.VUE_APP_API_URL;
Vue.prototype.SITE_URI = process.env.VUE_APP_SITE_URI;

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
        dateString = dateString.substr(0, 10);
    }
    return moment.unix(dateString).fromNow();
});
Vue.filter('date', function(dateString) {
    if(!dateString) return '';
    if(dateString.length > 10) {
        dateString = dateString.substr(0, 10);
    }
    return moment.unix(dateString).format("MMMM Do YYYY");
});
Vue.filter('timestamp', function(dateString) {

    if(!dateString) return '';
    if(dateString.length > 10) {
        dateString = dateString.substr(0, 10);
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
Vue.filter('did', function(didString) {
    if(!didString) {
        return '';
    }
    return 'did:bws:' + didString.substring(2, didString.length);
});
Vue.filter('fact', function(fact) {
    if(!fact) return '';

    if(fact.Bool) {
        return fact.Bool
    } else if(fact.Text) {
        return fact.Text
    } else if(fact.U8) {
        return fact.U8
    } else if(fact.U16) {
        return fact.U16
    } else if(fact.U32) {
        return fact.U32
    } else if(fact.U128) {
        return fact.U128
    } else if(fact.Date) {
        let a = fact.Date;
        let d=  new Date(Number(a[0].replace(',', '')), Number(a[1])-1, Number(a[2]));
        return moment(d).format("MMMM Do YYYY");
    } else if(fact.Iso8601) {
        return fact.Date
    } else {
        return "";
    }
});

Vue.filter('hexcheck', function(str) {
    if(isHex(str)){
        return hexToString(str);
    } else {
        return str;
    }
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
<<<<<<< Updated upstream
=======
Vue.filter('from_ms_to_date', function(date_num) {
    // return new Date(parseInt(date_num)).toDateString();
    return moment.unix(date_num/1000).format("DD MMM YYYY")
});
Vue.filter('from_ms', function(date_num) {
    // return new Date(parseInt(date_num)).toDateString();
    return moment.unix(date_num/1000).format("DD MMM YYYY hh:mm a")
});

Vue.filter('formatDate', function(a) {
    let d=  new Date(Number(a[0]), Number(a[1])-1, Number(a[2]));
    return moment(d).format("MMMM Do YYYY");
    // return date_string.replace('[', '').replace(']', '').replace(/,/g,'-')
});

Vue.filter('formatGRAM', function (n) {
    n /= 1e6;
    if (n < 1e6) return Number(n).toLocaleString() + ' GRAM';
    if (n >= 1e6 && n < 1e9) return Number(n / 1e6).toLocaleString() + ' MGRAM';
    if (n >= 1e9 && n < 1e12) return Number(n / 1e9).toLocaleString() + ' BGRAM';
    if (n >= 1e12) return Number(n / 1e12).toLocaleString() + ' TGRAM';
});

Vue.filter('hexToString', function (hexx) {
    let hex = hexx.toString();//force conversion
    let str = '';
    for (let i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
});
>>>>>>> Stashed changes

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
