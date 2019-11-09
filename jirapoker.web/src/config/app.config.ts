// Development environment name
const DEV_ENV = 'development';

// Const
const VERSION_NUMBER = '0.93.0.0';
const COOKIE_EXPIRE_DAYS: number = 1;
const HTTP_REQUEST_TIMEOUT: number = process.env.NODE_ENV !== DEV_ENV ? 30 * 1000 : 0;
const SIGN_OUT_TIMEOUT: number = process.env.NODE_ENV !== DEV_ENV ? 20 * 60 : 10 * 50;
const SIGN_OUT_NOTIFT_TIMEOUT: number = process.env.NODE_ENV !== DEV_ENV ? 15 * 60 : 5 * 50;

export default {
  /**
   * @description version number
   */
  VERSION_NUMBER,

  /**
   * @description Cookie expire days
   */
  COOKIE_EXPIRE_DAYS,

  /**
   * @description Timeout (Millionseconds) for Axios
   */
  HTTP_REQUEST_TIMEOUT,

  /**
   * @description Auto-SignOut timeout (seconds)
   */
  SIGN_OUT_TIMEOUT,

  /**
   * @description Show notify when the countdown reach this value (seconds)
   */
  SIGN_OUT_NOTIFT_TIMEOUT,
};
