import router from '@/router';
import MenuNode from '@/classes/model/MenuNode';
import { EnumAction, EnumActionStatus } from '@/classes/enum';
import store from '@/store';
import defaultMenu from '@/store/module/defaultMenu.ts';

const HOME_MENU: MenuNode = defaultMenu.HOME_MENU;
const MENUS: MenuNode[] = defaultMenu.MENUS;

export default {
  state: {
    breadCrumbList: [] as MenuNode[],
    // locale: localRead('local'), //HACK: must read the default locale from cookie or backend
    locale: 'zh-tw',
    menuList: [] as MenuNode[],
    homeMenu: HOME_MENU as MenuNode,
    errorList: [] as any[],
  },
  getters: {
    locale: (state: any) => state.locale,
    menuList: (state: any, getters: any, rootState: any) => state.menuList,
    homeMenu: (state: any, getters: any, rootState: any) => state.homeMenu,
    errorCount: (state: any) => state.errorList.length,
  },
  mutations: {
    setMenu(state: any, route: any) {
      const prunedMenuNodes: MenuNode[] = MENUS.map((x) => JSON.parse(JSON.stringify(x)));
      state.menuList = prunedMenuNodes;
    },
    setBreadCrumb(state: any, targetRoute: any) {
      // Search menu node by id or name
      const search = (menus: MenuNode[], targetNameOrId: any) => {
        for (const node of menus) {
          if (node.name === targetNameOrId || node.id === targetNameOrId) {
            return node;
          }

          if (node.children) {
            const target: any = search(node.children, targetNameOrId);
            if (target) {
              return target;
            }
          }
        }
      };

      // Menu nodes' sorting
      const sortMenus = (x: MenuNode, y: MenuNode) => {
        if (x.id > y.id) {
          return 1;
        } else if (x.id < y.id) {
          return -1;
        } else {
          return 0;
        }
      };

      if (state.menuList && targetRoute.name !== 'home') {

        state.breadCrumbList = [];
        state.breadCrumbList.push(state.homeMenu);

        const id = targetRoute.meta.pageId.toString();
        const idLength = id.length;
        let currentId = 0;
        for ( let i = 0; i < idLength; i++ ) {
          currentId += Number(id[i]) * Math.pow(10, id.length - i - 1);
          const parentMenu = search(MENUS, currentId);
          state.breadCrumbList.push(parentMenu);
          if (parentMenu.id === targetRoute.meta.pageId) {
            break;
          }
        }

      } else {
        // Clear and push the Home menu-node
        state.breadCrumbList = [];
        state.breadCrumbList.push(state.homeMenu);
      }
      return state.breadCrumbList.sort(sortMenus);
    },

    setLocale(state: any, lang: string) {
      // HACK: Must store the default locale to backend or cookie
      state.locale = lang;
      router.replace({ name: router.currentRoute.name, params: { lang } });
    },

    addError(state: any, error: any) {
      state.errorList.push(error);
    },

    cleanApp(state: any) {
      state.breadCrumbList = [];
      state.menuList = [];
      state.errorList = [];
    },
  },
  actions: {},
};
