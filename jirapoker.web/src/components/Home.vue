<template>
  <div class="text-center">
    <slider></slider>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Slider } from '@/components/_slider';
import router from '@/router';

export default Vue.extend({
  name: 'HeaderBar',
  components: {
    slider: Slider,
  },
  props: {
    collapsed: Boolean as PropType<boolean>,
  },
  methods: {
    handleCollpasedChange(state: any): void {
      this.$emit('on-coll-change', state);
    },
  },
});
</script>

<style lang="less" scoped>
.slide-center {
  position: absolute;
  vertical-align: middle;
  top: 55%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(0%, -50%);
}
</style>