// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
require('./assets/css/app.css')
    /* eslint-disable no-new */
Vue.prototype.$http = axios
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})