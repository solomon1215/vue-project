import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from "axios";
import './assets/fonts/iconfont.css';

Vue.config.productionTip = false;

axios.defaults.baseURL = 'http://0.0.0.0:8000/api/';

//请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => {
    //为请求头对象，添加token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
})

// 挂载axios
Vue.prototype.$http = axios;


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
