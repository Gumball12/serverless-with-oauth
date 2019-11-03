import Vue from 'vue';
import Vuex from 'vuex';

import _ from 'lodash';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // tokens
    accessToken: '',
    refreshToken: '',
  },
  getters: {
    /**
     * check token is empty
     * @return {Boolean} is token empty?
     */
    // eslint-disable-next-line max-len
    isTokenEmpty: ({ accessToken, refreshToken }) => _.every([accessToken, refreshToken], _.isEmpty),
  },
  mutations: {
    /**
     * update access token
     */
    updateAccessToken() {
    },
  },
  actions: {
    setAccessToken() {
      //
    },
    clearAccessToken() {
      //
    },
  },
});
