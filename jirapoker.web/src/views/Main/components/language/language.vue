<template>
  <div>
    <Dropdown trigger="click" @on-click="selectLang">
      <a href="javascript:void(0)" id="languageTitle">
        {{ title }}
        <Icon size="16" color="#9f9f9f" type="ios-arrow-down"/>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem v-for="(value, key) in localeList" :name="key" :key="`lang-${key}`">{{ value }}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'Language',
  props: {
    lang: String as PropType<string>,
  },
  data() {
    return {
      localeList: {
        'zh-tw': '繁體中文',
        // 'zh-cn': '简体中文',
        // 'en-us': 'English',
      } as any,
    };
  },
  watch: {
    lang(lang: string) {
      this.$i18n.locale = lang;
    },
  },
  computed: {
    title(): string {
      return this.localeList[this.lang];
    },
  },
  methods: {
    selectLang(name: string): void {
      this.$emit('on-lang-change', name);
    },
  },
});
</script>

<style lang="less" scoped>

.ivu-dropdown-menu > .ivu-dropdown-item{
    font-size: 14px !important;
    color: #4a4a4a;
}

#languageTitle{
  color:#4a4a4a !important;
  font-size:14px;
}

#languageTitle:hover{
  text-decoration:none !important;
}
</style>
