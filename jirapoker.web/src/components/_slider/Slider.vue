<template>
  <div>
    <div v-if="isShowSlider" :class="sliderClass">
      <carousel :navigate-to="[0, false]" :per-page="perPage" :pagination-enabled="false" :autoplay="isAutoplay" :autoplay-timeout="autoplayTimeout" :speed="autoplaySpeed" :loop="true" :adjustable-height="true" >
        <slide>
          <img :src="image1" />
        </slide>
        <slide>
          <img :src="image2" />
        </slide>
        <slide>
          <img :src="image3" />
        </slide>
      </carousel>
    </div>
    <!-- <div v-else  :class="sliderClass">
      <img :src="image1" />
    </div> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VueCarousel, { Carousel, Slide } from 'vue-carousel';
import image1 from '@/assets/images/seminar/01.png';
import image2 from '@/assets/images/seminar/02.png';
import image3 from '@/assets/images/seminar/03.png';

const AUTOPLAY_TIMOUT: number = 5000;
const AUTOPLAY_SPEED: number = 500;
const CSS_SLIDER_MENU_COLLAPSE_ON: string = 'slider-menu-collapse-on text-center';
const CSS_SLIDER_MENU_COLLAPSE_OFF: string = 'slider-menu-collapse-off text-center';

Vue.use(VueCarousel);

export default Vue.extend({
  name: 'Slider',
  components: {
    Carousel,
    Slide,
  },
  data() {
    return {
      isShowSlider: false as boolean,
      perPage: 1 as number,
      isAutoplay: false as boolean,
      sliderClass: CSS_SLIDER_MENU_COLLAPSE_OFF as string,
      autoplayTimeout: 500 as number,
      image1,
      image2,
      image3,
    };
  },
  computed: {
    autoplaySpeed() {
      return AUTOPLAY_SPEED;
    },
  },
  methods: {
    refreshSlides() {
      const vm: any = this;
      vm.isShowSlider = true;
      vm.isAutoplay = true;
      vm.isShowSlider = false;
      vm.isAutoplay = false;
      setTimeout(() => {
        vm.autoplayTimeout = AUTOPLAY_TIMOUT;
        vm.isShowSlider = true;
        vm.isAutoplay = true;
      }, 500);
    },
  },
  created() {
    const vm: any = this;

    vm.$event.$on('refreshSlides', (state: any) => {
      const isSideMenuCollapseOn = state;
      vm.sliderClass = isSideMenuCollapseOn === true ? CSS_SLIDER_MENU_COLLAPSE_ON : CSS_SLIDER_MENU_COLLAPSE_OFF;
      vm.refreshSlides();
    });
  },
  mounted() {
    const vm: any = this;

    vm.refreshSlides();

    window.onresize = (event: any) => {
      vm.refreshSlides();
    };
  },
});
</script>

<style lang="less" scoped>

.slider {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    max-width: 1646px;
    max-height: 758px;
  }
}

.slider-menu-collapse-off {
  .slider;
}

.slider-menu-collapse-on {
  .slider;
}

@media only screen and (width: 1920px) {
  .slider-menu-collapse-off {
    img {
      min-width: 100%;
    }
  }
}
</style>