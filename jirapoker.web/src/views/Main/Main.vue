<template>
  <Layout style="height: 100%">
    <div style="height: 4.5%; background-color: #0070bd;">
      <img id="logo-cybesoft" src="@/assets/images/logo-cybersoft/logo-cybersoft.png" style="height:initial"/>
    </div>
    <Layout style="height: 95.5%" class="main" >
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider shadow" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="activeName" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <div class="logo-con">
          <a href="" @click.prevent="turnToPage({name:'home', param:'{lang:'+ locale + '}'})">
            <img id="logo-con" v-show="!collapsed" src="@/assets/images/logo/logo.png" key="max-logo" />
            <img id="logo-con-min" v-show="collapsed" src="@/assets/images/logo-min/logo-min.png" key="min-logo" />
          </a>
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :message-unread-count="unreadCount" :user-avatar="require('@/assets/images/avatar/avatar.png')"/>
          <language @on-lang-change="setLocale" style="margin-right: 20px;" :lang="locale"/>
          <!-- <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store> -->
        </header-bar>
      </Header>
      <Content class="main-content-con" v-if="isShowContent">
        <Layout class="main-layout-con">
          <div id="tag-nav-wrapper" class="tag-nav-wrapper">
            <div class="container-fluid">
                <div class="row-fluid welcome-msg">
                    <div class="text-left">
                      <span class="user" id="userName">
                        {{ currentUser.name }}
                      </span>
                      <span class="msg">
                        {{ $t('main.welcomeMsg') }}
                      </span>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="text-right normal">
                      <i class="fas fa-clock"></i> {{ nowDateTime }}
                    </div>
                </div>
            </div>
          </div>
          <Content class="main-wrapper">
              <div class="content-wrapper">
                <router-view :key="$route.fullPath"></router-view>
                <ABackTop :height="100" :bottom="80" :right="50" container=".main-wrapper"></ABackTop>
              </div>       
              <div class="footer-wrapper">
                <div class="container-fluid">
                  <div class="row-fluid">
                    <div class="text-center">
                      <span class="copyright">
                        copyright© 2019 Cybersoft Corporation. All rights reserved (Version : {{ versionNumber }}) 
                      </span>
                    </div>
                  </div>
                </div>
              </div>
          </Content>
        </Layout>
      </Content>
    </Layout>
    <Modal footer-hide v-model="isShowCautionSignOutModal"
        class="custom-modal"
        :class-name="modalWrapClass"
        :mask-closable="false"
        :closable="false"
        width="416"> 
        <p class="custom-modal-title">
            <i class="fas fa-exclamation-circle custom-modal-icon"></i>
            &nbsp;
            <span>{{ $t('text.caution') }}</span>
        </p>
        <p class="custom-modal-content" v-html="$t('main.cautionSignOutPart1') + countdown + $t('main.cautionSignOutPart2')"></p>
    </Modal>
    </Layout>
  </Layout>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import SideMenu from './components/side-menu';
import HeaderBar from './components/header-bar';
import User from './components/user';
import ABackTop from './components/a-back-top';
import Language from './components/language';
import { toastrCustom } from '@/modules/toastr.factory';
import { NoPermissionError } from '@/classes/errModel';
import { EnumNoPermissionErrorSource } from '@/classes/enum';
import IdleVue from 'idle-vue';
import appConfig from '@/config/app.config.ts';
import './Main.less';

const { VERSION_NUMBER, SIGN_OUT_TIMEOUT, SIGN_OUT_NOTIFT_TIMEOUT } = appConfig;

// Define a vue instance for eventHub
Vue.use(IdleVue, {
  eventEmitter: new Vue(),
  idleTime: 1 * 1000, // Million seconds
});

// Global variable
let countdownInterval: any = null;

export default Vue.extend({
  name: 'Main',
   components: {
    SideMenu,
    HeaderBar,
    Language,
    User,
    ABackTop,
  },
  data() {
    return {
      isShowContent: false,
      collapsed: false as boolean,
      unreadCount: 0 as number,
      activeName: '' as string,
      isShowCautionSignOutModal: false as boolean,
      nowDateTime: new Date() as Date,
      countdown: '' as string,
      versionNumber: VERSION_NUMBER as string,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: 'user',
    }),
    menuList(): any[] {
      const vm: any = this;
      return vm.$store.getters.menuList;
    },
    locale(): string {
      const vm: any = this;
      return vm.$store.state.app.locale;
    },
    modalWrapClass(): string {
      return 'dark-signout-modal-wrap';
    },
  },
  watch: {
    $route(newRoute: any) {
      const vm: any = this;
      if (newRoute) {
        vm.setBreadCrumb(newRoute);
      }
    },
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setLocale',
      'setErrorSource',
    ]),
    ...mapActions({
      signOut: 'signOut',
      refresh: 'refresh',
    }),

    turnToPage(route: any) {
      const vm: any = this;
      let path: string = '';
      let name: string = '';
      let params: any = {};
      let query: any = {};

      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1]);
        return;
      }
      if (typeof route === 'string' && route.startsWith('/')) {
        path = route;
      } else if (typeof route === 'string') {
        name = route;
      } else {
        vm.activeName = route.name; // This will refresh menu nodes and collapse them
        name = route.name;
        params = route.params;
        query = route.query;
      }

      if (path !== '') {
        vm.$router.push(path);
      } else {
        vm.$router.push({ name, params, query});
      }
    },
    handleCollapsedChange(state: any) {
      const vm: any = this;
      vm.collapsed = state;

      // TODO: Remove when the home component's slide show is forbidden
      vm.$event.$emit('refreshSlides', state);
    },
    handleClick(item: any) {
      this.turnToPage(item);
    },
    /**
     * Format seconds to string format: mm:ss
     * @params {number} secs
     */
    formatSeconds2Str(secs: number) {
      const vm: any = this;
      const minutes = parseInt(String(secs / 60), 10);
      const seconds = parseInt(String(secs % 60), 10);
      const minuteStr = minutes < 10 ? '0' + String(minutes) : String(minutes);
      const secondStr = seconds < 10 ? '0' + String(seconds) : String(seconds);
      return `${minuteStr}` + vm.$t('text.minute') + `${secondStr}` + vm.$t('text.second');
    },
    /**
     * Start the Now-datetime timer.
     */
    startNowTimer() {
      const vm: any = this;
      setInterval(() => {
        vm.nowDateTime = vm.$options.filters.formattedDateTime(vm.$moment());
      }, 1000);
    },
    /**
     * Start the auto-signout timer.
     * @param {number} duration - seconds
     */
    startSignOutTimer(duration: number) {
      const vm: any = this;
      let timer = duration;

      // Clear interval
      clearInterval(countdownInterval);
      countdownInterval = null;

      countdownInterval = setInterval( async () => {
        --timer;
        if (timer < 0) {
          clearInterval(countdownInterval);
          countdownInterval = null;
          // Close any modal
          vm.$Modal.remove();
          // Vuex User store : Sign out
          await vm.signOut();
          // Redirect to Sign-in page
          vm.$router.replace({ name: 'login', query: { forceSignOut: true }});
        } else if (timer === SIGN_OUT_NOTIFT_TIMEOUT) {
          vm.isShowCautionSignOutModal = true;
        }
        vm.countdown = vm.formatSeconds2Str(timer);

      }, 1000);
    },
  },
  onActive(): any {
    const vm: any = this;
    vm.countdown = vm.formatSeconds2Str(SIGN_OUT_TIMEOUT);
    clearInterval(countdownInterval);
    vm.isShowCautionSignOutModal = false;
  },
  onIdle() {
    const vm: any = this;
    vm.startSignOutTimer(SIGN_OUT_TIMEOUT); // Start Auto-SignOut timer
  },
  async mounted() {
    const vm: any = this;
    // Signout if the user store is cleared and cannot re-get user profile by cookie
    if (!vm.currentUser.id) {
      const isRefreshSuccess = await vm.refresh();
      if (!isRefreshSuccess) {
        vm.$router.replace({ name: 'login' });
      }
    }

    vm.setBreadCrumb(this.$route);
    vm.countdown = vm.formatSeconds2Str(SIGN_OUT_TIMEOUT);
    vm.startNowTimer();

    // Start Auto-SignOut timer (Bug: if we only use keyboards on login to enter main component, the onIdle wont be triggered)
    setTimeout(() => {
      if (!countdownInterval) {
        vm.startSignOutTimer(SIGN_OUT_TIMEOUT);
      }
    }, 3000);

    vm.isShowContent = true;
  },
  beforeDestroy() {
    clearInterval(countdownInterval);
  },
} as any);
</script>