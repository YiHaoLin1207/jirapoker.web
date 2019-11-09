<template>
  <a @click="handleChange" :class="['sider-trigger-a', collapsed ? 'collapsed' : '']"><Icon :type="icon" :size="size" /></a>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'siderTrigger',
  props: {
    collapsed: Boolean as PropType<boolean>,
    icon: {
      type: String as PropType<string>,
      default: 'navicon-round',
    },
    size: {
      type: Number as PropType<number>,
      default: 20,
    },
  },
  methods: {
    handleChange() {
      this.$emit('on-change', !this.collapsed);
    },
  },
});
</script>

<style lang="less">
@import './sider-trigger.less';
</style>
