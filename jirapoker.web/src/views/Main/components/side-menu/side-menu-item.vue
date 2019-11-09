<template>
  <Submenu :name="`${parentName}`">
    <template slot="title">
      <common-icon :type="parentItem.meta.icon || ''"/>
      <span>{{ showTitle(parentItem) }}</span>
    </template>
    <template v-for="item in children">
      <template>
        <side-menu-item v-if="item.children && item.children.length > 0" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`"><common-icon :type="item.meta.icon || ''"/><span>{{ showTitle(item) }}</span></menu-item>
      </template>
    </template>
  </Submenu>
</template>

<script lang="ts">
import mixin from './mixin';
import itemMixin from './item-mixin';
export default {
  name: 'SideMenuItem',
  mixins: [ mixin, itemMixin ],
};
</script>
