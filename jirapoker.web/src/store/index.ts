import Vue from 'vue';
import Vuex from 'vuex';

import app from './module/app';
import user from './module/user';
import currentIssue from './module/currentIssue';
import routeRecord from './module/routeRecord';

Vue.use(Vuex);

export default new Vuex.Store({
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
    routeRecord,
    currentIssue,
  },
});
