import { Account, Issue } from '@/classes/apiModel';
import { EnumAction, EnumActionStatus } from '@/classes/enum';
import { AuthService } from '@/services';
import { UserProfile } from '@/classes/model';
import { toastrCustom } from '@/modules/toastr.factory';
import { EnumHttpStatusCode } from '@/classes/enum';
import { isNull } from '@/libs/util';
import moment from 'moment';
import store from '@/store';

export default {
  state: {
    user: {} as UserProfile,
    avatarImgPath: '' as string,
    estimatedIssues: [] as Issue[],
  },
  getters: {
    user: (state: any) => state.user,
    avatarImgPath: (state: any) => state.avatarImgPath,
    estimatedIssues: (state: any) => state.estimatedIssues,
  },
  mutations: {
    setAvatar(state: any, user: UserProfile) {
      state.avatarImgPath = user.avatarUrl;
    },
    setUser(state: any, user: UserProfile) {
      state.user = new UserProfile({
        accountId: user.accountId as string,
        userName: user.userName as string,
        avatarUrl: user.avatarUrl as string,

      });
    },
    setEstimatedIssues(state: any, estimatedIssues: Issue[]) {
      state.estimatedIssues = estimatedIssues;
    },
    reset(state: any) {
      state.user = {};
      state.avatarImgPath = '';
      state.estimatedIssues = [];
    },
  },
  actions: {

    /**
     * Sign In
     *
     * @param {{ commit: any, dispatch: any}} { commit, dispatch }
     * @param {Account} payload
     * @returns
     */
    async signIn( { commit, dispatch }: { commit: any, dispatch: any}, payload: Account) {
      // Inform backend
      // const account = await auth.signInAsync(user);
      const auth = new AuthService();

      const userProfile: UserProfile = await auth.signInAsync(payload);
      commit('setUser', userProfile);
      commit('setAvatar', userProfile);
      await dispatch('setSideMenu');

      const isSignInOk = true;
      return isSignInOk;
    },

    /**
     * Sign Out
     *
     * @param {{ commit: any, state: any}} { commit, state }
     */
    async signOut({ commit, state }: { commit: any, state: any}) {
      try {
        // Inform backend
        // Mutation
        commit('reset');
        commit('cleanRouteRecord');
        commit('cleanApp');
        commit('cleanQuery');
      } catch (err) {
        throw err;
      }
    },

    /**
     * Refresh User store (Cookie-based)
     *
     * @param {{ commit: any, state: any}} { commit, dispatch }
     * @returns {Promise<boolean>}
     */
    async refresh( { state, dispatch }: { state: any, dispatch: any}) {
      const isOk: boolean = true;
      // if (!state.user.userName) {
      //  return !isOk;
      // }
      // Get permissions
      await dispatch('setSideMenu');

      return isOk;

    },

  /**
   * Get this use all permissions  //TODO: this function should be merged into SignIn with Backend API CR
   * @param {{ commit: any, state: any}} { commit, state }
   */
    async setSideMenu({ commit, state }: { commit: any, state: any }) {
      commit('setMenu');
    },

    /**
     * Let all of components check they can act
     * @param action
     * @param path
     * @returns {Promise<boolean>}
     */
    execute({ state }: { state: any }, {action, path}: {action: EnumAction, path: number}) {
      let pathStr = '';

      if (path) {
        pathStr = path.toString().replace(new RegExp('0*$'), '');
      } else {
        const breadCrumbList: any = store.getters.breadCrumbList;
        if (breadCrumbList.length === 1) {
          return true;  // Everyone logined have permission to see home pTree
        }
        path = breadCrumbList[breadCrumbList.length - 1].id;
        pathStr = path.toString().replace(new RegExp('0*$'), '');
      }

      const pathStrLength = pathStr.length;
      let pTree = state.permissions;
      let pathStrIndex = 0;
      let pTreeLength = pTree.length;
      let pTreeIndex = 0;
      let flag = false;

      while (pTreeIndex < pTreeLength) {
        if (pTree[pTreeIndex].id.toString()[pathStrIndex] === pathStr[pathStrIndex]) {
          pTree = pTree[pTreeIndex];
          if (pathStrIndex === pathStrLength - 1) {
            flag = true;
            break;
          }
          if (!isNull(pTree.webPages)) {
            pTree = pTree.webPages;
            pathStrIndex++;
            pTreeIndex = 0;
            pTreeLength = pTree.length;
          } else {
            break;
          }
        } else {
          pTreeIndex++;
        }
      }

      return flag ? pTree.actionBitmap[action - 1] === EnumActionStatus.True : false;
    },
  },
};
