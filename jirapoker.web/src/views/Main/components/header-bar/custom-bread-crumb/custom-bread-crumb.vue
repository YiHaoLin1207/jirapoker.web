<template>
  <div class="custom-bread-crumb" id="custom-bread-crumb" >
    <Breadcrumb :style="{fontSize: `${fontSize}px`}">
      <BreadcrumbItem v-for="item in list" :to="item.to" :key="`bread-crumb-${item.name}`">
        <common-icon v-if="getCustomIconName(item)" :size="14" :type="getCustomIconName(item)"/>
        <span :class="(showIcon && item.meta.icon)?'title':''">{{ showTitle(item) }}</span>
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';
import './custom-bread-crumb.less';
import CommonIcon from '@/components/_icon';
import { MenuNode, MenuNodeMeta } from '@/classes/model';

export default Vue.extend({
  name: 'customBreadCrumb',
  components: {
    CommonIcon,
  },
  props: {
    list: {
      type: Array as PropType<any[]>,
      default: [],
    },
    fontSize: {
      type: Number as PropType<number>,
      default: 14,
    },
    showIcon: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  methods: {
    showTitle(item: any): string {
      const vm: any =  this;
      const localizedTitle: string = String(this.$t(`menu.${item.name}`));
      return localizedTitle;
    },
    getCustomIconName(item: MenuNode): string {
      return item.meta.icon || '';
    },
  },
});
</script>

<style scoped lang="less">
.title {
  padding-left: 8px;
}
</style>