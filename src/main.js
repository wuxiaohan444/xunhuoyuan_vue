import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './utils/rem'


import axios from 'axios'
import qs from 'qs'

const env = "prod";
const link = {
    dev: "http://192.168.2.146:8081",
    prod: "https://www.b156.com.cn/inspector"
}[env];
Vue.prototype.bus = new Vue;
Vue.prototype.fixedIp = function () {//固定ip
    return link
};

export default function ajax(method, url, data, callback, headers, isQs) {
    this.bus.$emit('loading', true);
    let way = method === 'post' || method === 'POST' ? 'data' : 'params';
    isQs = isQs === false ? isQs : true;
    data = (method === 'post' || method === 'POST') && isQs ? qs.stringify(data) : data;
    let header = headers ? headers : 'application/x-www-form-urlencoded;charset=UTF-8';
    axios({
        method: method,
        url: url,
        [way]: data,
        headers: {
            'Content-Type': header
        }
    }).then((res) => {
        this.bus.$emit('loading', false);
        if (res.data.code === 0) {
            callback(res.data);
        } else {
            this.bus.$emit('tips', {
                show: true,
                title: res.data.data
            });
            setTimeout(() => {
                switch (res.data.code) {
                    case 1001:
                        router.push("/login");
                        break;
                }
            }, 500)
        }
    })
}


Vue.config.productionTip = false;
Vue.prototype.$qs = qs;
Vue.prototype.$axios = ajax;

new Vue({
    render: h => h(App),
    router,
}).$mount('#app');
