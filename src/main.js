import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import md5 from 'js-md5';

// 引入全局样式
import './assets/css/global.css'

// 引入axios
import './config/axios'

// 引入ElementUI
import './config/element.js'

Vue.config.productionTip = false
Vue.prototype.$md5 = md5;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
