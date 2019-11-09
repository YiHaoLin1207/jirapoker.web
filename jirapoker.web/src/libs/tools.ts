export const forEach = (arr: any[], fn: any) => {
  if (!arr.length || !fn) {
    return;
  }

  let i: number = -1;
  const len: number = arr.length;
  while (++i < len) {
    const item: any = arr[i];
    fn(item, i, arr);
  }
};

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1: any[], arr2: any[]) => {
  const len: number = Math.min(arr1.length, arr2.length);
  let i = -1;
  const res: any[] = [];
  while (++i < len) {
    const item = arr2[i];
    if (arr1.indexOf(item) > -1) {
      res.push(item);
    }
  }
  return res;
};

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1: any[], arr2: any[]): any => {
  return Array.from(new Set([...arr1, ...arr2]));
};

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr: any[], arr: any[]): boolean => {
  return targetarr.some((_) => arr.indexOf(_) > -1);
};

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export function oneOf(value: any, validList: any[]) {
  for (const validVal of validList) {
    if (value === validVal) {
      return true;
    }
  }
  return false;
}

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const getHandledValue = (num: number): string => {
  return num < 10 ? '0' + num : num.toString();
};

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent;
  const isExplorer = (exp: any) => {
    return ua.indexOf(exp) > -1;
  };
  if (isExplorer('MSIE')) {
    return 'IE';
  } else if (isExplorer('Firefox')) {
    return 'Firefox';
  } else if (isExplorer('Chrome')) {
    return 'Chrome';
  } else if (isExplorer('Opera')) {
    return 'Opera';
  } else if (isExplorer('Safari')) {
    return 'Safari';
  }
};


/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj: any, key: any) => {
  if (key) {
    return key in obj;
  } else {
    const keysArr = Object.keys(obj);
    return keysArr.length;
  }
};

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1: any, obj2: any) => {
  const keysArr1 = Object.keys(obj1);
  const keysArr2 = Object.keys(obj2);
  if (keysArr1.length !== keysArr2.length) {
    return false;
  } else if (keysArr1.length === 0 && keysArr2.length === 0) {
    return true;
  } else { // eslint-disable-next-line
    return !keysArr1.some((key) => obj1[key] !== obj2[key]);
  }
};

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on: any = (function() {
  if (document.addEventListener) {
    return function(element: any, event: any, handler: any) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element: any, event: any, handler: any) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off: any = (function() {
  if (document.removeEventListener) {
    return function(element: any, event: any, handler: any) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element: any, event: any, handler: any) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();
