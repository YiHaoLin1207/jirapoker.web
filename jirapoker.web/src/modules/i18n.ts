import Vue from 'vue';
import axios, { AxiosPromise } from 'axios';
import VueI18n, { LocaleMessages } from 'vue-i18n';
import { EnumAction } from '@/classes/enum';
import { EnumActionLocale } from '@/classes/enum/EnumAction';
import { LocaleMsg } from '@/classes/model';
import router from '../router';
import store from '@/store';

Vue.use(VueI18n);
axios.defaults.withCredentials = false;

const loadedLanguages: string[] = []; // our default language that is prelaoded
// const supportedLangs = ['en-us', 'zh-tw', 'zh-cn'];
const supportedLangs = ['zh-tw'];
const dateTimeFormats = {
  'en-us': {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
    },
  },
  'zh-tw': {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
    },
  },
  'zh-cn': {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    },
  },
};

const loadLocalMessages = (): LocaleMessages => {
  const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages: LocaleMessages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
};

const setLanguage = (to: any): string => {
  let lang = to.params.lang;
  if (!lang || supportedLangs.indexOf(to.params.lang) < 0) {
    lang = 'zh-tw';
  }
  store.state.app.locale = lang;
  return lang;
};


const getTargetRoute = (urlTo: any, to: any): any => {
  if (urlTo !== null && urlTo.name !== undefined) {
    return urlTo;
  } else {
    return to;
  }
};


// setting routing gurad ref: https://router.vuejs.org/guide/advanced/navigation-guards.html
const SetRouteGuard = () => {
  router.beforeEach(async (to: any, from: any, next: any) => {
    const lang = setLanguage(to);
    if (store.getters.user.userName === undefined) {  // access withoout user
      if (to.path === '/zh-tw/login') {
        next();
      } else if (!store.getters.loginNow) {
        store.commit('setLoginNow', true);
        store.commit('setUrlTo', to);
        next('/' + lang + '/login');
      } else {
        const target = getTargetRoute(store.getters.urlTo, to);
        store.commit('setUrlTo', null);
        next('/' + lang + target.path.slice(target.path.indexOf('/', 2)));
      }
    } else {    // access with user
        next();
    }
  });

};

const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'zh-tw',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'zh-tw',
  silentTranslationWarn: true, // process.env.NODE_ENV === 'production',
  dateTimeFormats,
  messages: loadLocalMessages(),
});

export { supportedLangs, i18n, SetRouteGuard };
