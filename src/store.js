import Vue from 'vue';
import Vuex from 'vuex';

import _ from 'lodash';

import createPersistedState from 'vuex-persistedstate';
import SecureLS from 'secure-ls'; // for encryption

// init
Vue.use(Vuex);

const ls = new SecureLS({ isCompression: false });

export default new Vuex.Store({
  state: {
    accessToken: '',
    refreshToken: '',
    userId: '',
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
    /**
     * update user id
     */
    updateUserId(state, userId) {
      state.userId = userId;
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
    clearToken({ commit }) {
      commit('updateAccessToken', '');
      commit('updateRefreshToken', '');
      commit('updateUserId', '');
    },
  },

  // persisted state for vuex with Secure-LS (encryption)
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: key => ls.remove(key),
      },
    }),
  ],
});
