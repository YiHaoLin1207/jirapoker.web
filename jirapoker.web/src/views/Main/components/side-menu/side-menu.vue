<template>
  <div class="side-menu-wrapper">
    <slot></slot>
    <Menu ref="menu" v-show="!collapsed" :active-name="activeName" :open-names="openedNames" :accordion="accordion" :theme="theme" width="auto" @on-select="handleSelect">
      <template v-for="item in menuList">
        <template>
          <side-menu-item v-if="item.children && item.children.length > 0" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
          <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`"><common-icon :type="item.meta.icon || ''"/><span>{{ showTitle(item) }}</span></menu-item>
        </template>
      </template>
    </Menu>
    <div class="menu-collapsed" v-show="collapsed" :list="menuList">
      <template v-for="item in menuList">
        <collapsed-menu v-if="item.children && item.children.length > 0" @on-click="handleSelect" hide-title :root-icon-size="rootIconSize" :icon-size="iconSize" :theme="theme" :parent-item="item" :key="`drop-menu-${item.name}`"></collapsed-menu>
        <Tooltip transfer v-else :content="showTitle(item)" placement="right" :key="`drop-menu-${item.name}`">
          <a @click="handleSelect(item)" class="drop-menu-a" :style="{textAlign: 'center'}"><common-icon :size="rootIconSize" :color="textColor" :type="item.meta.icon || (item.children && item.children[0].meta.icon)"/></a>
        </Tooltip>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import SideMenuItem from './side-menu-item.vue';
import CollapsedMenu from './collapsed-menu.vue';
import { getUnion } from '@/libs/tools';
import mixin from './mixin';

export default Vue.extend({
  name: 'SideMenu',
  mixins: [mixin],
  components: {
    SideMenuItem,
    CollapsedMenu,
  },
  props: {
    menuList: {
      type: Array as PropType<any[]>,
      default: [],
    },
    collapsed: {
      type: Boolean as PropType<boolean>,
    },
    theme: {
      type: String as PropType<string>,
      default: 'light', // dark/light/primary
    },
    rootIconSize: {
      type: Number as PropType<number>,
      default: 18,
    },
    iconSize: {
      type: Number as PropType<number>,
      default: 18,
    },
    accordion: Boolean as PropType<boolean>,
    activeName: {
      type: String as PropType<string>,
      default: '',
    },
    openNames: {
      type: Array as PropType<any[]>,
      default: () =>  [],
    },
  },
  data() {
    return {
      openedNames: [] as any[],
    };
  },
  methods: {
    handleSelect(name: string): void {
      this.$emit('on-select', name);
    },
    getOpenedNamesByActiveName(name: string): any {
      return this.$route.matched
        .map((item) => item.name)
        .filter((item) => item !== name);
    },
  },
  computed: {
    textColor(): string {
      return this.theme === 'dark' ? '#fff' : '#495060';
    },
  },
  watch: {
    activeName(name: string) {
      if (this.accordion) {
        this.openedNames = this.getOpenedNamesByActiveName(name);
      } else {
        this.openedNames = getUnion(
          this.openedNames,
          this.getOpenedNamesByActiveName(name),
        );
      }
    },
    openNames(newNames: any[]) {
      this.openedNames = newNames;
    },
    openedNames() {
      this.$nextTick(() => {
        (this.$refs.menu as any).updateOpened();
      });
    },
  },
  mounted() {
    this.openedNames = getUnion(
      this.openedNames,
      this.getOpenedNamesByActiveName(name),
    );
  },
});
</script>
<style lang="less">
@import "./side-menu.less";
</style>
