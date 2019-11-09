<template>
  <Dropdown
    ref="dropdown"
    @on-click="handleClick"
    :class="hideTitle ? '' : 'collased-menu-dropdown'"
    :transfer="hideTitle"
    :placement="placement"
  >
    <a
      class="drop-menu-a"
      type="text"
      @mouseover="handleMousemove($event, children)"
      :style="{textAlign: !hideTitle ? 'left' : ''}"
    >
      <common-icon :size="rootIconSize" :color="textColor" :type="parentItem.meta.icon"/>
      <span class="menu-title" v-if="!hideTitle">{{ showTitle(parentItem) }}</span>
      <Icon style="float: right;" v-if="!hideTitle" type="ios-arrow-forward" :size="16"/>
    </a>
    <DropdownMenu ref="dropdown" slot="list">
      <template v-for="child in children">
        <collapsed-menu
          v-if="showChildren(child)"
          :icon-size="iconSize"
          :parent-item="child"
          :key="`drop-${child.name}`"
        ></collapsed-menu>
        <DropdownItem v-else :key="`drop-${child.name}`" :name="child.name">
          <common-icon :size="iconSize" :type="child.meta.icon"/>
          <span class="menu-title">{{ showTitle(child) }}</span>
        </DropdownItem>
      </template>
    </DropdownMenu>
  </Dropdown>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';
import mixin from './mixin';
import itemMixin from './item-mixin';
import { findNodeUpperByClasses } from '@/libs/util';

export default Vue.extend({
  name: 'CollapsedMenu',
  mixins: [mixin, itemMixin],
  props: {
    hideTitle: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    rootIconSize: {
      type: Number as PropType<number>,
      default: 16,
    },
  },
  data() {
    return {
      placement: 'right-end' as string,
    };
  },
  methods: {
    handleClick(name: string) {
      this.$emit('on-click', name);
    },
    handleMousemove(event: any, children: any) {
      const { pageY } = event;
      const height = children.length * 38;
      const isOverflow = pageY + height < window.innerHeight;
      this.placement = isOverflow ? 'right-start' : 'right-end';
    },
  },
  mounted() {
    const dropdown = findNodeUpperByClasses((this.$refs.dropdown as any).$el, [
      'ivu-select-dropdown',
      'ivu-dropdown-transfer',
    ]);
    if (dropdown) {
      dropdown.style.overflow = 'visible';
    }
  },
});
</script>
