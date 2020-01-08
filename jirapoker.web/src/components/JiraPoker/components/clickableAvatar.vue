<template>
<div @click="handleClick">
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
  methods: {
    handleClick() { 
      this.$emit('click');
    },
  },
  created() { console.log("Created"); }

});
</script>
