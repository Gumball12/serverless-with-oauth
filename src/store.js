import Vue from 'vue';
import Vuex from 'vuex';

import _ from 'lodash';

import createPersistedState from 'vuex-persistedstate';
import SecureLS from 'secure-ls'; // for encryption

// init
Vue.use(Vuex);

const ls = new SecureLS({ isCompression: false });

// tools

/**
 * shuffle string
 * @param {String} s
 */
const shuffleString = s => _.flowRight(_.partial(_.join, _, ''), _.shuffle)(s);

export default new Vuex.Store({
  state: {
    accessToken: '',
    refreshToken: '',
    userId: '',

    // testing tools
    isExpiredAccessToken: false,
    isExpiredRefreshToken: false,
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
     * @param {String} userId
     */
    updateUserId(state, userId) {
      state.userId = userId;
    },
    /**
     * update is-expired access token value
     * @param {Boolean} b
     */
    updateIsExpiredAccessToken(state, b) {
      state.isExpiredAccessToken = b;
    },
    /**
     * update is-expired refresh token value
     * @param {*} b
     */
    updateIsExpiredRefreshToken(state, b) {
      state.isExpiredRefreshToken = b;
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
    /**
     * switch is-expired token value
     * @param {String} target target name (AccessToken | RefreshToken)
     */
    switchIsExpired({ commit, state }, target) {
      commit(`updateIsExpired${target}`, !state[`isExpired${target}`]);

      // RefreshToken: true => AccessToken: true
      if (target === 'RefreshToken' && state.isExpiredRefreshToken) {
        commit('updateIsExpiredAccessToken', true);
      }

      // AccessToken: false => RefreshToken: false
      if (target === 'AccessToken' && !state.isExpiredAccessToken) {
        commit('updateIsExpiredRefreshToken', false);
      }
    },
    /**
     * shuffle token, userId string
     */
    shuffleToken({ commit, state }) {
      commit('updateAccessToken', shuffleString(state.accessToken));
      commit('updateRefreshToken', shuffleString(state.refreshToken));
      commit('updateUserId', shuffleString(state.userId));
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
      // add ignore keys
      reducer: (persistedState) => {
        const blackList = ['isExpiredAccessToken', 'isExpiredRefreshToken'];
        return _.omit(persistedState, blackList);
      },
    }),
  ],
});
