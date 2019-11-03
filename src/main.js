import Vue from 'vue';
import env from './env'; // environments
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import '@babel/polyfill';

Vue.config.productionTip = false;

Vue.prototype.$env = env;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
