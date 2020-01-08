import Vue from 'vue';
import Vuex from 'vuex';

import app from './module/app';
import user from './module/user';
import currentIssue from './module/currentIssue';
import createPersistedState from 'vuex-persistedstate';
import * as Cookies from 'js-cookie';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: ['user'],
    }),
  ],
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    app,
    user,
    currentIssue,
  },
});
