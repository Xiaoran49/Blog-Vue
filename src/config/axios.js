import Vue from "vue";
import axios from "axios";

// 基准路径
axios.defaults.baseURL = "/api"

// 响应拦截
axios.interceptors.response.use((res) => {
    return res.data;
});

// 绑定到原型链
Vue.prototype.$axios = axios
