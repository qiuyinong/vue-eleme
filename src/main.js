// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import './common/stylus/index.stylus';
Vue.config.productionTip = false;
import RouterConfig from './routerconfig.js';
Vue.use(VueRouter);
Vue.use(VueResource);
const router = new VueRouter({
  routes: RouterConfig,
  linkActiveClass: 'active'
});
/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App)
});

