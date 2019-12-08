import Vue from 'vue';
import router from '@/router';
import { EnumHttpStatusCode } from '@/classes/enum';
import { HttpRequestError, HttpTimeoutError, HttpUnauthorizedError } from '@/classes/errModel';
import appConfig from '@/config/app.config.ts';
import store from '@/store';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const { HTTP_REQUEST_TIMEOUT } = appConfig;

let isAlreadyFetchingAccessToken = false;
const vm: any = new Vue();
let loader: any = 'undefined';
let requestCounter: number = 0;

axios.interceptors.request.use( (config: AxiosRequestConfig) => {
  // setup UI blocking
  const routeName: string | undefined = router.currentRoute.name;
  if (requestCounter === 0 && routeName !== 'login' && checkUiBlockingExcludedCondition(config)) {
    loader = vm.$loading.show({
        canCancel: false,
        isFullPage: true,
        backgroundColor: '#ffffff',
        color: '#1d90ff',
        opacity: 0.7,
        zIndex: 999,
        loader: 'dots',
      }, {});
    requestCounter += 1;
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

axios.interceptors.response.use( (response: AxiosResponse<any>) => {
    // hide UI blocking
    setTimeout(() => {
        if (requestCounter > 0) {
            requestCounter -= 1;
            if (requestCounter === 0) {
                loader.hide();
            }
        }
    }, 200);

    return response;
}, async (error: any) => {

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

function checkUiBlockingExcludedCondition(requestConfig: AxiosRequestConfig) {
  let showUiBlocking: boolean = true;
  const url: any = requestConfig.url;
  const excludedUrlPtn = `[^\\s$.?#].[^\\s]*([^\\/\\s]+\\/)(.*)(\\/Validate\\/){1}(.*)`;
  if ( typeof url !== 'undefined' && url.match(excludedUrlPtn)) {
    showUiBlocking = false;
  }
  return showUiBlocking;
}

export default axios;
