
<template lang="html">
  <div @click="view" class="text-center cursor-pointer">
      <i class="fas fa-search"></i>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default {
  name: 'VtView',
  props: {
    data: {
      type: Object as PropType<any>,
      default: {},
    },
    index: {
      type: Number as PropType<number>,
    },
    column: {
      type: String as PropType<string>,
    },
  },
  methods: {
    view() {
      const vm: any = this;
      vm.$event.$emit('vue-tables.view', vm.data);
    },
  },
};
</script>
