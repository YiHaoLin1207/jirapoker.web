import Vue, { PropType } from 'vue';
import CommonIcon from '@/components/_icon';
import { mapMutations, mapActions, mapGetters } from 'vuex';

export default Vue.extend({
  components: {
    CommonIcon,
  },
  methods: {
    showTitle(item: any) {
      // return showTitle(item, this);
      const vm = this;
      const { title, __titleIsFunction__ } = item.meta;
      if (!title.name && !title ) {
        return;
      } else {
        const currentLang = this.$store.state.app.locale;
        return this.$t(`menu.${item.name}`);
      }
      // if (useI18n) {
      //   if (title.includes('{{') && title.includes('}}') && useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
      //   else if (__titleIsFunction__) title = item.meta.title
      //   else title = vm.$t(item.name)
      // }
      // else
      // title = (item.meta && item.meta.title) || item.name;
      // return title;
    },
    showChildren(item: any) {
      return item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways));
    },
    getNameOrHref(item: any, children0: any) {
      return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name);
    },
  },
});
