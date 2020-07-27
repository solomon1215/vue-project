import Vue from 'vue'
import App from './App.vue'
import router from  './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from "axios";
import './assets/fonts/iconfont.css';

Vue.config.productionTip = false;

axios.defaults.baseURL = 'http://0.0.0.0:8000/api/';
// 挂载axios
Vue.prototype.$http = axios;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
