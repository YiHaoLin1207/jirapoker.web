import { forEach, hasOneOf, objEqual } from '@/libs/tools';

export const hasChild = (item: any) => {
  return item.children && item.children.length !== 0;
};

const showThisMenuEle = (item: any, access: any) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};

/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list: any[], access: any) => {
  const res: any[] = [];
  forEach(list, (item: any) => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      const obj: any = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta,
        children: [] as any[],
      };
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access);
      }
      if (item.meta && item.meta.href) {
        obj.href = item.meta.href;
      }
      if (showThisMenuEle(item, access)) {
        res.push(obj);
      }
    }
  });
  return res;
};

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route: any, homeRoute: any) => {
  const homeItem: any = { ...homeRoute, icon: homeRoute.meta.icon };
  const routeMetched: any = route.matched;
  if (routeMetched.some((item: any) => item.name === homeRoute.name)) {
    return [homeItem];
  }
  let res = routeMetched.filter((item: any) => {
    return item.meta === undefined || !item.meta.hideInBread;
  }).map((item: any) => {
    const meta = { ...item.meta };
    if (meta.title && typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true;
      meta.title = meta.title(route);
    }
    const obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta,
    };
    return obj;
  });

  res = res.filter((item: any) => {
    return !item.meta.hideInMenu;
  });
  return [{ ...homeItem, to: homeRoute.path }, ...res];
};

export const getRouteTitleHandled = (route: any) => {
  const router: any = { ...route };
  const meta: any = { ...route.meta };
  let title = '';
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true;
      title = meta.title(router);
    } else {
      title = meta.title;
    }
  }
  meta.title = title;
  router.meta = meta;
  return router;
};

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access: any, route: any): boolean => {
  if (route.meta && route.meta.access) {
    return hasOneOf(access, route.meta.access);
  } else {
    return true;
  }
};


export const findNodeUpperByClasses: any = (ele: any, classes: any) => {
  const parentNode = ele.parentNode;
  if (parentNode) {
    const classList = parentNode.classList;
    if (classList && classes.every((className: any) => classList.contains(className))) {
      return parentNode;
    } else {
      return findNodeUpperByClasses(parentNode, classes);
    }
  }
};


/* ScrollTop animation */
export const scrollTop = (el: any, from: number = 0, to: number, duration = 500, endCallback: any) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      (window as any).webkitRequestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      (window as any).msRequestAnimationFrame ||
      function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  }
  const difference = Math.abs(from - to);
  const stepForScroll = Math.ceil(difference / duration * 50);

  const scroll = (start: number, end: number, step: number) => {
    if (start === end) {
      const isEndCallBack = endCallback && endCallback();
      return;
    }

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  };

  scroll(from, to, stepForScroll);
};


/* check if is null object or array */
export const isNull = (thing: any) => {
  if (!thing) {
    return true;
  }
  return Object.keys(thing).length > 0 ? false : true;
};

/**
 * @export
 * @class EnumEx: Extension class for Enum
 */
export class EnumEx {

  public static getNamesAndValues<T extends number>(e: any) {
      return EnumEx.getNames(e).map((n: string) => ({ name: n, value: e[n] as T }));
  }

  public static getNames(e: any) {
      return EnumEx.getObjValues(e).filter((v: any) => typeof v === 'string') as string[];
  }

  public static getValues<T extends number>(e: any) {
      return EnumEx.getObjValues(e).filter((v: any) => typeof v === 'number') as T[];
  }

  private static getObjValues(e: any): Array<number | string> {
      return Object.keys(e).map((k: any) => e[k]);
  }
}
