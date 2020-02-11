import Vue from 'vue';
import router from '@/router';
import { EnumHttpStatusCode } from '@/classes/enum';
import { HttpRequestError, HttpTimeoutError, HttpUnauthorizedError } from '@/classes/errModel';
import appConfig from '@/config/app.config.ts';
import store from '@/store';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Mutex, MutexInterface } from 'async-mutex';

const { HTTP_REQUEST_TIMEOUT } = appConfig;
const mutex = new Mutex();

let isAlreadyFetchingAccessToken = false;
const vm: any = new Vue();
let loader: any = 'undefined';
let requestCounter: number = 0;

axios.interceptors.request.use( (config: AxiosRequestConfig) => {
  // setup UI blocking
  const routeName: string | undefined = router.currentRoute.name;
  if (checkUiBlockingCondition({ routeName, requestConfig: config })) {
    mutex.acquire().then((release: any) => {
      if (requestCounter === 0) {
        requestCounter += 1;
        release();
        loader = vm.$loading.show({
          canCancel: false,
          isFullPage: true,
          backgroundColor: '#ffffff',
          color: '#1d90ff',
          opacity: 0.7,
          zIndex: 999,
          loader: 'dots',
        }, {});
      } else {
        requestCounter += 1;
        release();
      }
    });
  }


  // Base Url
  config.baseURL = process.env.VUE_APP_HOST_BACKEND_URL;

  // Headers
  config.headers = {
    'Content-Type': 'application/json',
  };

  // Timeout
  config.timeout = HTTP_REQUEST_TIMEOUT; // Milliseconds

  return config;

}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use((response: AxiosResponse<any>) => {
  // hide UI blocking
  if (checkUiBlockingCondition({ response })) {
    setTimeout(() => {
      mutex.acquire().then((release: any) => {
        requestCounter = requestCounter - 1 < 0 ? 0 : requestCounter - 1 ;
        if (requestCounter === 0) {
          release();
          loader.hide();
        } else {
          release();
        }
      });
    }, 200);
  }

  return response;
}, async (error: any) => {
  // reset UI Block counter
  resetUiBlockCounter();

  // Start Handling Issues
  if (error.code === 'ECONNABORTED') { // Timeout error
    const timeoutErr = new HttpTimeoutError(error, error.config.url);
    return Promise.reject(timeoutErr); // Return original response
  }

  const { config, response: { status } } = error;
  const originalRequest = config;
  let isRefreshOk: boolean = false;

  if (status === EnumHttpStatusCode.INVALID_TOKEN) {
    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;
      isRefreshOk = await store.dispatch('refreshToken');
      isAlreadyFetchingAccessToken = false;
    }

    if (isRefreshOk) {
      const retryOriginalRequest = new Promise((resolve) => {
        resolve(axios(originalRequest));
      });
      return retryOriginalRequest; // Return the resposne from original request with new token
    } else {
      return Promise.reject(error); // Return original response
    }
  } else { // Non 498 response

    const url = originalRequest.url;
    let httpErr = error;

    switch (status) {
      case 401:
        httpErr = new HttpUnauthorizedError(error, url);
        break;
      default:
        httpErr = new HttpRequestError(error, url, status);
        break;
    }

    return Promise.reject(httpErr);
  }
});

function checkUiBlockingCondition(condition: {
  routeName?: string | null,
  requestConfig?: AxiosRequestConfig,
  response?: AxiosResponse<any>,
}) {
  let excluded: boolean = false;
  const excludedUrlPtn = `api/issue/story-point`;
  if (condition.routeName && condition.routeName === 'login') {
    excluded = true;
  }
  if (condition.requestConfig) {
    const url: any = condition.requestConfig.url;
    if (typeof url !== 'undefined' && url.match(excludedUrlPtn)) {
      excluded = true;
    }
  }
  if (condition.response) {
    const url: any = parseURL(condition.response.request.responseURL).pathname;
    if (typeof url !== 'undefined' && url.match(excludedUrlPtn)) {
      excluded = true;
    }
  }
  return !excluded;
}
// hack reference: https://www.abeautifulsite.net/parsing-urls-in-javascript
function parseURL(url: string) {
  const parser = document.createElement('a');
  const searchObject: any = {};
  let queries;
  let split;
  let i;
  // Let the browser do the work
  parser.href = url;
  // Convert query string to object
  queries = parser.search.replace(/^\?/, '').split('&');
  for (i = 0; i < queries.length; i++) {
    split = queries[i].split('=');
    searchObject[split[0]] = split[1];
  }
  return {
    protocol: parser.protocol,
    host: parser.host,
    hostname: parser.hostname,
    port: parser.port,
    pathname: parser.pathname,
    search: parser.search,
    searchObject,
    hash: parser.hash,
  };
}

function resetUiBlockCounter() {
  mutex.acquire().then((release: any) => {
    requestCounter = 0;
    loader.hide();
    release();
  });
}


export default axios;
