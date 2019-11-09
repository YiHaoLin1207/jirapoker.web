<template>
  <component v-if="type" :is="iconType" :type="iconName" :color="iconColor" :size="iconSize"/>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import FaIcon from './fa-icon.vue';

export default Vue.extend({
  name: 'CommonIcon',
  components: { FaIcon },
  props: {
    type: {
      type: String as PropType<string>,
    },
    color: String as PropType<string>,
    size: Number as PropType<number>,
  },
  computed: {
    iconType(): string {
      return this.type.indexOf('_') === 0 ? 'Icon' : 'FaIcon';
    },
    iconName(): string {
      // Use iview Icon by naming "_ios-book" or use font-awesome by naming "fas fa-clock" for example
      return this.iconType === 'Icon'
        ? this.getCustomIconName(this.type)
        : this.type;
    },
    iconSize(): any {
      return this.size || (this.iconType === 'FaIcon' ? 12 : undefined);
    },
    iconColor(): string {
      return this.color || '';
    },
  },
  methods: {
    getCustomIconName(iconName: string) {
      return iconName.slice(1);
    },
  },
});
</script>