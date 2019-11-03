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
     * @param {String} accessToken new access token
     */
    updateAccessToken(state, accessToken) {
      state.accessToken = accessToken;
    },
    /**
     * update refresh token
     * @param {String} refreshToken  new refresh token
     */
    updateRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken;
    },
  },
  actions: {
    /**
     * set new access/refresh token
     * @param {Object} payload access/refresh token
     * @param {Object} payload.accessToken new access token
     * @param {Object} payload.refreshToken new refresh token
     */
    setToken({ commit }, { accessToken, refreshToken }) {
      commit('updateAccessToken', accessToken);
      commit('updateRefreshToken', refreshToken);
    },
    /**
     * clear token
     */
    clearAccessToken({ commit }) {
      commit('updateAccessToken', '');
      commit('updateRefreshToken', '');
    },
  },
});
