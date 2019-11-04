import Vue from 'vue';
import Router from 'vue-router';

import vuex from './store';

Vue.use(Router);

// vue-router
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue'),
    },
    { // page not found
      path: '*',
      name: 'pnf',
      component: () => import('./views/PNF.vue'),
    },
  ],
});

// router guard
router.beforeEach((to, from, next) => {
  // check token before enter to login page
  if (to.name === 'login' && !vuex.getters.isTokenEmpty) {
    return next('/');
  }

  // check token before enter to home page
  if (to.name === 'home' && vuex.getters.isTokenEmpty) {
    return next('/login');
  }

  // otherwise
  return next();
});

export default router;
