window.$ = window.jQuery = require('jquery');

import { createApp } from 'vue'
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

// Filters are removed in Vue 3. We can use global properties or helper functions.
// Here we register them as global properties for compatibility, but usage in templates might need adjustment.
// Or better, we can provide a global $filters object.

const filters = {
    currency(value, symbol) {
        value = value.toString();
        return CurrencyFormatter.format(new BigNumber(value).toString(), {symbol: symbol || '$ '});
    },
    count(value) {
        if(!value) return '';
        return new BigNumber(value).toFormat(2);
    },
    fromNow(dateString) {
        if(!dateString) return '';
        if(dateString.length > 10) {
            dateString = dateString.substr(0, 10);
        }
        return moment.unix(dateString).fromNow();
    },
    date(dateString) {
        if(!dateString) return '';
        if(dateString.length > 10) {
            dateString = dateString.substr(0, 10);
        }
        return moment.unix(dateString).format("MMMM Do YYYY");
    },
    timestamp(dateString) {
        if(!dateString) return '';
        if(dateString.length > 10) {
            dateString = dateString.substr(0, 10);
        }
        return moment.unix(dateString).format("MMMM Do YYYY, h:mm:ss a");
    },
    capitalize(value) {
        if(!value) return '';
        value = value.toString();
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    },
    lowercase(value) {
        if(!value) return '';
        value = value.toString();
        return value.toLowerCase()
    },
    truncate(text, length, suffix) {
        if(text.length <= length) return text;
        return text.substring(0, length) + suffix;
    },
    did(didString) {
        if(!didString) {
            return '';
        }
        return 'did:bws:' + didString.substring(2, didString.length);
    },
    fact(fact) {
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
    },
    hexcheck(str) {
        if(isHex(str)){
            return hexToString(str);
        } else {
            return str;
        }
    },
    from_ms_to_date(date_num) {
        return moment.unix(date_num/1000).format("DD MMM YYYY")
    },
    from_ms(date_num) {
        return moment.unix(date_num/1000).format("DD MMM YYYY hh:mm a")
    },
    formatGRAM(n) {
        n /= 1e6;
        if (n < 1e6) return Number(n).toLocaleString() + ' GRAM';
        if (n >= 1e6 && n < 1e9) return Number(n / 1e6).toLocaleString() + ' MGRAM';
        if (n >= 1e9 && n < 1e12) return Number(n / 1e9).toLocaleString() + ' BGRAM';
        if (n >= 1e12) return Number(n / 1e12).toLocaleString() + ' TGRAM';
    },
    hexToString(hexx) {
        let hex = hexx.toString();//force conversion
        let str = '';
        for (let i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
}

app.config.globalProperties.$filters = filters;


app.use(router);
app.use(store);

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
