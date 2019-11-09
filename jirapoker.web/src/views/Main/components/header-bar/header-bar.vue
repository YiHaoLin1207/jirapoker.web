<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger>
    <custom-bread-crumb show-icon style="margin-left: 20px;" :list="breadCrumbList"></custom-bread-crumb>
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import router from '@/router';
import siderTrigger from './sider-trigger';
import customBreadCrumb from './custom-bread-crumb';

export default Vue.extend({
  name: 'HeaderBar',
  components: {
    siderTrigger,
    customBreadCrumb,
  },
  props: {
    collapsed: Boolean as PropType<boolean>,
  },
  computed: {
    breadCrumbList(): any[] {
      return this.$store.state.app.breadCrumbList;
    },
  },
  methods: {
    handleCollpasedChange(state: any): void {
      this.$emit('on-coll-change', state);
    },
  },
});
</script>

<style lang="less">
.header-bar {
  width: 100%;
  height: 100%;
  position: relative;

  .custom-content-con {
    float: right;
    height: auto;
    padding-right: 20px;
    line-height: 64px;
    & > * {
      float: right;
    }
  }

  .home-link {
    display: inline-block;
    vertical-align: top;
    font-size: 20px;
    color: #515a6e;
    width: 80px;
    text-align: right;
  }
}

</style>