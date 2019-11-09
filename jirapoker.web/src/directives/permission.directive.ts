import Vue, { VNode } from 'vue';
import router from '@/router';
import { EnumAction } from '@/classes/enum';
import store from '@/store';

const validate = async (el: HTMLElement, binding: any, vnode: VNode): Promise<boolean> => {
    const actionKey = binding.value || (el as any).name || '';
    let isValid = false;
    const path: number | undefined = router.currentRoute.meta.pageId;

    if (actionKey && path) {
      const action = EnumAction[actionKey];
      // Check permission
      isValid = await store.dispatch('execute', { action, path });
    }

    return isValid;
};

// Permission directive
Vue.directive('permission', {
  inserted: async (el: HTMLElement, binding: any, vnode: VNode) => {
    const isValid = await validate(el, binding, vnode);
    if (!isValid) {
      if (vnode.elm && vnode.elm.parentElement) {
        // Remove element
        vnode.elm.parentElement.removeChild(vnode.elm);
      } else {
        // Just hide
        el.hidden = true;
      }
    }
  },
});

// Permission directive
Vue.directive('permissionDisable', {
  inserted: async (el: HTMLElement, binding: any, vnode: VNode) => {
    const isValid = await validate(el, binding, vnode);
    if (!isValid) {
      (el as HTMLInputElement).disabled = true;
    }
  },
});
