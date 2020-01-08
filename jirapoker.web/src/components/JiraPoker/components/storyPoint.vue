<template>
  <span class="badge badge-pill semaphore" v-if="isZero">
      {{ point }}
  </span>
  <span class="badge badge-pill semaphore pointNotZero" v-else>
      {{ point }}
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'storyPoint',
  props: {
    point: { type: Number, default: 0 },
  },
  computed:{
      isZero(): boolean {
        return this.point == 0;
    },
  }
});
</script>

<style>

.semaphore {
  background: #78839c;
  font-size: 16px !important; 
  right: 2%;
  width: 40px;
  color: white;
  position: absolute;
}
.pointNotZero{
    background: #007bff !important; 
}

</style>