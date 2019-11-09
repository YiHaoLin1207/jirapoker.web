<template>
    <div :class="classes" :style="styles" @click="back">
        <slot>
            <div :class="innerClasses">
                <i class="fas fa-arrow-up"></i>
            </div>
        </slot>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { scrollTop } from '@/libs/util';
import { on, off } from '@/libs/tools';
const prefixCls = 'ivu-back-top';

export default Vue.extend({
  name: 'ABackTop',
  props: {
    height: {
      type: Number as PropType<number>,
      default: 400,
    },
    bottom: {
      type: Number as PropType<number>,
      default: 30,
    },
    right: {
      type: Number as PropType<number>,
      default: 30,
    },
    duration: {
      type: Number as PropType<number>,
      default: 1000,
    },
    container: {
      default: window,
    },
  },
  data() {
    return {
      backTop: false as boolean,
    };
  },
  mounted() {
    on(this.containerEle, 'scroll', this.handleScroll);
    on(this.containerEle, 'resize', this.handleScroll);
  },
  beforeDestroy() {
    off(this.containerEle, 'scroll', this.handleScroll);
    off(this.containerEle, 'resize', this.handleScroll);
  },
  computed: {
    classes(): any {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-show`]: this.backTop,
        },
      ];
    },
    styles(): any {
      return {
        bottom: `${this.bottom}px`,
        right: `${this.right}px`,
      };
    },
    innerClasses(): string {
      return `${prefixCls}-inner`;
    },
    containerEle(): any {
      if (this.container === window) {
        return  window;
      } else {
        const selector: string = (this.container as unknown) as string;
        return  document.querySelector(selector);
      }
    },
  },
  methods: {
    handleScroll(): void {
      this.backTop = this.containerEle.scrollTop >= this.height;
    },
    back(): void {
      const target = typeof this.container === 'string' ? this.containerEle : (document.documentElement || document.body);
      const sTop = target.scrollTop;
      scrollTop(this.containerEle, sTop, 0, this.duration, null);
      this.$emit('on-click');
    },
  },
});
</script>

<style lang="less" scoped>

.ivu-back-top-inner{
  width:48px;
  height:48px;
  border-radius: 8px;
  border: solid 2px #797979;
  background-color: #f9f9f9;
    box-shadow: none;
}

.ivu-back-top-inner:hover{
  background-color: #f9f9f9;
  border: solid 2px #2d8cf0;
}

.ivu-back-top i{
  padding: 11px 12px;
  color: #797979;
}

.ivu-back-top i:hover{
  color: #2d8cf0;
} 
</style>
