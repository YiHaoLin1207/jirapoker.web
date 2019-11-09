
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    parentItem: {
      type: Object as PropType<any>,
      default: {},
    },
    theme: String as PropType<string>,
    iconSize: Number as PropType<number>,
  },
  computed: {
    parentName(): string {
      return this.parentItem.name;
    },
    children(): any[] {
      return this.parentItem.children;
    },
    textColor(): string {
      return this.theme === 'dark' ? '#fff' : '#495060';
    },
  },
});
