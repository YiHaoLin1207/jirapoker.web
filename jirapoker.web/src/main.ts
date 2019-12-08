import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
/* Filters */
import '@/modules/filters';
/* bootstrap4 */
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import locale from 'iview/dist/locale/zh-TW';
/* iView */
import iView from 'iview';
import 'iview/dist/styles/iview.css';
/* toastr */
import 'toastr/build/toastr.min.css';
/* Moment.js */
import moment from 'moment';
/* vue-table-2 */
import {ClientTable, Event} from 'vue-tables-2';

/* font-awesome */
import '@fortawesome/fontawesome-free/css/all.min.css';
// import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
// import '@fortawesome/fontawesome-free/css/solid.css';
/* vue-form */
import VueForm from 'vue-form';
/* vue-loading-overlay (must create typing file)*/
import 'vue-loading-overlay/dist/vue-loading.css';
import Loading from 'vue-loading-overlay';
/* vue-i18n */
import { i18n, SetRouteGuard } from './modules/i18n';
/* Global css */
import './index.less';
/* Directives */
import '@/directives';

import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
const baseUrl: string = process.env.VUE_APP_HOST_BACKEND_URL!;
const socket = io(baseUrl);

/* Global Vue config */
Vue.config.productionTip = false;
/* Plugins */


/* Global instances */
// Vue.prototype.$http = axiosNtlm;
Vue.prototype.$event = new Vue();
Vue.prototype.$moment = moment;


/* Global use */
Vue.use(iView, {locale});
Vue.use(VueForm);
Vue.use(ClientTable, {}, false, 'bootstrap4', 'footerPagination');
Vue.use(Loading, {isLoading: false}, {});
Vue.use(VueSocketIOExt, socket, {store});

/* Global setting */
/* SetRouteGuard(); */

new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
}).$mount('#app');
