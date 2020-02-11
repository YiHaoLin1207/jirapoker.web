<template>
<div class="clickable-avatar" @click="handleClick" :style="style">
  <Tooltip :content="user.userName" placement="bottom">
    <Avatar :src="user.avatarUrl" />
  </Tooltip>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { UserProfile } from '@/classes/model';

export default Vue.extend({
  name: 'clickableAvatar',
  props: { user: Object, },
  data() {
    return {
      style: {} as any,
    };
  },
  methods: {
    handleClick() { 
      this.$emit('click');
      this.$set(this.style,'background-color','#A7FFF6');
    },
  },
  created() { console.log("Created"); }

});
</script>
<style scoped lang="less">
.clickable-avatar {
  padding: 3px;
  background-color: red;
}
</style>