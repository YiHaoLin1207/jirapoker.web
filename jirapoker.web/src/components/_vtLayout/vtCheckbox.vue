
<template lang="html">
  <div class="text-center">
      <Checkbox label="" size="default" v-model="data.selected" @on-change="changed(data)"></Checkbox>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default {
  name: 'VtCheckbox',
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
    changed(data: Account) {
      const vm: any = this;
      vm.$event.$emit('vue-tables.checked', data);
    },
  },
};
</script>

<style scoped lang="less">

</style>
