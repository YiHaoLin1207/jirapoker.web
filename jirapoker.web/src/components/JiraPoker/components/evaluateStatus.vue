<template>
  <span :style="lightColor">
    <i class="fas fa-circle" :style="lightStyle"></i>&nbsp;&nbsp;
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'evaluatedStatus',
  props: {
    estimated: { type: Boolean, default: false },
  },
  data(){
    return {
      lightStyle: {'font-size': '1px'},
    };
  },
  computed:{
    lightColor() {
      if(this.estimated){
        return "color: yellowgreen;";
      }
      else{
        return "color: #e6ebf1;";
      }
    },
  }
});
</script>