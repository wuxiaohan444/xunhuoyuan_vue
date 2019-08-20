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

export default function ajax(method, url, data, callback) {
    this.bus.$emit('loading', true);
    let way = method === 'post' || method === 'POST' ? 'data' : 'params';
    data = method === 'post' || method === 'POST' ? qs.stringify(data) : data;
    axios({
        method: method,
        url: url,
        [way]: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
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
                        router.push("/");
                        break;
                }
            }, 500)

        }
    })

}


// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

Vue.config.productionTip = false;
Vue.prototype.$qs = qs;
Vue.prototype.$axios = ajax;

new Vue({
    render: h => h(App),
    router,
}).$mount('#app');
