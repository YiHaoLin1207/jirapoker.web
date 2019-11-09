import Vue from 'vue';
import axios, { AxiosPromise } from 'axios';
import VueI18n, { LocaleMessages } from 'vue-i18n';
import { EnumAction, EnumNoPermissionErrorSource } from '@/classes/enum';
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

const getI18n = (lang: string, key: string): AxiosPromise<any> => {
  const serverUrl: string = process.env.VUE_APP_HOST_BACKEND_URL!;
  const uri = serverUrl.concat(`api/locale/get/${key}/${lang}`);
  return axios.get(uri);
};

///  Load localized dictionaries asynconically
const loadLanguageAsync = async (lang: string, key: string): Promise<any> => {
  if (loadedLanguages.indexOf(lang) < 0) {
    i18n.locale = lang;
    return getI18n(lang, key);
  } else {
    return Promise.resolve(() => {
      i18n.locale = lang;
    });
  }
};


const handleLocalization = (to: any, lang: string): void => {
  const key = to.query.key || to.name;
  const currMsg: any = i18n.getLocaleMessage(lang);

  if (!currMsg[key]) {
    loadLanguageAsync(lang, key).then((response) => {
      for (const k in response.data) {
        if (k) {
          currMsg[k] = response.data[k];
        }
      }
      const msg = new LocaleMsg(lang, currMsg);
      i18n.setLocaleMessage(msg.lang, msg.messages);
    });
  }
};

const setLanguage = (to: any): string => {
  let lang = to.params.lang;
  if (!lang || supportedLangs.indexOf(to.params.lang) < 0) {
    lang = 'zh-tw';
  }
  store.state.app.locale = lang;
  return lang;
};


const checkPageExist = (to: any): boolean => {
  const resolvedRoute = router.resolve({name: to.name, params: to.params});
  if (to.name === null || resolvedRoute.resolved.matched.length === 0) {
    return false;
  }
  return true;
};

const refreshAsync = async (): Promise<boolean> => {
  return await store.dispatch('refresh');
};

const getTargetRoute = (urlTo: any, to: any): any => {
  if (urlTo !== null && urlTo.name !== undefined) {
    return urlTo;
  } else {
    return to;
  }
};

const getTargetAction = (to: any): EnumAction => {
  const action = to.name.split('_');
  if ( EnumActionLocale.indexOf(action) > 0) {
    return EnumActionLocale.indexOf(action);
  } else {
    return EnumAction.Query;
  }
};

const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'zh-tw',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'zh-tw',
  silentTranslationWarn: true, // process.env.NODE_ENV === 'production',
  dateTimeFormats,
  messages: loadLocalMessages(),
});

export { supportedLangs, i18n, loadLanguageAsync };
