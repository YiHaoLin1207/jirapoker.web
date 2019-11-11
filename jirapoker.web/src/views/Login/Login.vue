<template>
<div class="page">
    <div class="content back-earth">
      <div class="container">
        <div class="row">
          <div class="col-md-12"><img id="logo" src="@/assets/images/logo/logo.png"></div>
        </div>
      </div>
      <div class="container">
        <div class="card card-container">
          <img id="profile-img" class="profile-img-card" src="@/assets/images/avatar/avatar.png">
          <p id="profile-name" class="profile-name-card"></p>
          <vue-form :state="formstate" @submit.prevent="submit">
            <div class="is-invalid text-left" v-if="isForceSignOut && !formstate.$submitted" v-html="$t('login.textForceSignOut')">
            </div>
            <div class="is-invalid text-left" v-if="isSignInFail && !formstate.$dirty" v-html="$t('login.textSignInFail')">
            </div>
            <validate auto-label :custom="{'format-check': validate('jiraUser', user.jiraUser)}"> <!-- validate jiraUser [start] -->
              <div :class="formFieldClass(formstate.jiraUser, 'jiraUser')">
                <Input v-model="user.jiraUser" size="large" autofocus @on-keyup="cleanErrMsg()" :placeholder="$t('login.accountPlaceholder')" name="jiraUser"/>
              </div>
              <div style="margin-top:5px">
                <field-messages name="jiraUser">
                  <div slot="format-check" class="is-invalid text-left">{{ textFormatIncorrect }}</div>
                </field-messages>
              </div>
            </validate> <!-- validate jiraUser [end] --> 

            <div class="top-buffer"></div>
            <validate auto-label> <!-- validate pwd [start] -->
              <div :class="formFieldClass(formstate.jiraToken, 'jiraToken')">
                <Input type="password" v-model="user.jiraToken" size="large" @on-keyup="cleanErrMsg()" :placeholder="$t('login.pwdPlaceholder')"  name="jiraToken"/>
              </div>
            </validate> <!-- validate pwd [end] --> 
            <div style="margin-top:120px">
              <button id="loginButton" ref="loginButton" class="btn btn-lg btn-primary btn-block btn-signin" type="submit">{{ $t('login.signIn') }}</button>
            </div>
          </vue-form>
        </div>
        <!-- /card-container -->
      </div>
      <!-- /container -->
      <div class="copyright"> 
          copyright© 2019 Cybersoft Corporation. All rights reserved (Version : {{ versionNumber }}) 
      </div>
    </div>
    <!-- /content -->
    <loading :active.sync="isLoading"
             :can-cancel="true"
             :is-full-page="isFullPage"
             :opacity="1"
             :color="color"
             :background-color="bgColor">
      <div slot="default">
          <div class="loading-logo"><img src="@/assets/images/loading/loading.gif"></div>
          <div class="loading-text">Loading MiniTIS...</div>
      </div>
    </loading>
  </div>
  <!-- /page -->
</template>


<script lang="ts">
import Vue, { PropType } from 'vue';
import AxiosPromise from 'axios';
import router from '@/router';

import axios from '@/modules/axios.factory';
import { isNull } from '@/libs/util';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { toastrCustom } from '@/modules/toastr.factory';
import { Account } from '@/classes/apiModel';
import appConfig from '@/config/app.config.ts';
import Loading from 'vue-loading-overlay';

const { VERSION_NUMBER } = appConfig;

export default Vue.extend({
  name: 'Login',
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: false,
      isFullPage: true,
      bgColor: '#ffffff',
      color: '#1d90ff',
      useSlot: true,
      formstate: {} as any,
      user: {} as Account,
      isSignInFail: false as boolean,
      isForceSignOut: false as boolean,
      versionNumber: VERSION_NUMBER as string,
    };
  },
  computed: {
    ...mapGetters({
      locale: 'locale',
      urlTo: 'urlTo',
    }),
    menuList(): any[] {
      return this.$store.getters.menuList;
    },
    textFormatIncorrect() {
      const vm: any = this;
      const t1 = vm.$options.filters.i18nSentence([
        vm.$t('text.such'),
        vm.$t('login.account'),
        vm.$t('text.format'),
        vm.$t('text.incorrect'),
        vm.$t('mark.comma'),
      ], vm.locale, true);
      const t2 = vm.$options.filters.i18nSentence([
        vm.$t('text.please'),
        vm.$t('text.confirm'),
        vm.$t('mark.exclamation'),
        ], vm.locale);

      return  `${t1} ${t2}`;
    },
  },
  props: {},
  methods: {
    ...mapMutations([
      'setUrlTo',
    ]),
    ...mapActions({
      signIn: 'signIn',
    }),
    // Form validation class
    formFieldClass(field: any, prop: string) {
      const vm: any = this;
      if (field) {
        if ( (vm.formstate.$submitted && vm.user[prop].length === 0 ) || field.$invalid) {
          return 'ivu-form-item-error';
        }
      }
      return '';
    },
    cleanErrMsg() {
      const vm: any = this;
      vm.isForceSignOut = false;
      vm.isSignInFail = false;
      vm.formstate.$submitted = false;
    },
    async validate(prop: string, val: any) {
      const vm: any = this;
      return true;
    },
    async submit() {
      const vm: any = this;
      let isOk: boolean = false;
      const valdation = await vm.validate('jiraUser', vm.user.jiraUser);
      if (isNull(vm.user.jiraUser) || isNull(vm.user.jiraToken) || !valdation) {
        return;
      }

      try {
        vm.isLoading = true;
        isOk = await vm.signIn(vm.user);
        if (isOk) {
          setTimeout(() => {
            if (vm.urlTo && vm.urlTo.name !== undefined && vm.urlTo.name !== 'login') {
              const target = vm.urlTo;
              vm.setUrlTo(null);
              router.push({ path: '/' + vm.locale + target.path.slice(target.path.indexOf('/', 2)) });
            } else {
              router.push({ name: 'home' });
            }
          }, 1500);
        } else {
          vm.isSignInFail = true;
        }
      } catch (err) {
        toastrCustom.error(err);
      } finally {
        vm.isLoading = isOk;
      }

    },
    handleKeyUp(event: any) {
      const vm: any = this;
      if (event.keyCode === 13) {  // enter 13
        vm.$refs.loginButton.click();
      }
    },
  },
  created() {
    const vm: any = this;
    if (vm.$route.query.forceSignOut) {
      vm.isForceSignOut = true;
    }

    // DO NOT remove these codes unless you know what you are doing!!
    vm.user = new Account(
    {
      jiraUser: process.env.VUE_APP_SIGNIN_UID || '',
      jiraToken: process.env.VUE_APP_SIGNIN_PWD || '',
    });
    // Even if you know what you re doing, just DO NOT remove them!!
  },
  mounted() {
    const vm: any = this;
    window.addEventListener('keyup', vm.handleKeyUp);
  },
  beforeDestroy() {
    const vm: any = this;
    window.removeEventListener('keyup', vm.handleKeyUp);
  },
});
</script>

<style lang="less" scoped>
.page {
  display: table;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  text-align: center;

  .back-earth {
    /* backgroud */
    background: url("~@/assets/images/login/bk_earth.svg");
    background-color: #f3f6f8;
    background-size: 990px 567px;
    background-repeat: no-repeat;
    background-position: center center;
    padding-top: 40px;
  }
}

.content {
  display: table-cell;
  vertical-align: middle;
}

.title {
  font-size: 45px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
}

.card-container.card {
  padding: 40px 40px;
  width: 380px;
  height: 500px;
}

.form-control-login {
  width: 360px;
  height: 44px;
  border-radius: 4px;
  border: solid 2px #dcd8ff;
  background-color: #ffffff;
}

.btn {
  font-weight: 700;
  height: 36px;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
  &:hover {
      background-color: #26B7F0 !important;
    }
}

/*
 * Card component
 */
.card {
  background-color: #ffffff;
  /* just in case there no content*/
  padding: 20px 25px 30px;
  border-radius: 4px;
  border: solid 1px #2d8cf0;
  margin: 0 auto 25px;
  margin-top: 20px;
  /* shadows and rounded borders */
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  // // -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  // -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  // box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 30%;
  height: auto;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}

/*
 * Form styles
 */
.profile-name-card {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin: 20px 0 0;
  min-height: 1em;
}

.form-signin .form-control:focus {
  border-color: rgb(104, 145, 162);
  outline: 0;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgb(104, 145, 162);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgb(104, 145, 162);
}

.btn.btn-signin {
  background-color: #57c6f2;
  /* background-color: linear-gradient(rgb(104, 145, 162), rgb(12, 97, 33));*/
  padding: 0px;
  font-weight: 700;
  font-size: 14px;
  height: 36px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  border-radius: 4px;
  border: none;
  -o-transition: all 0.218s;
  -moz-transition: all 0.218s;
  -webkit-transition: all 0.218s;
  transition: all 0.218s;
}


.btn.btn-signin:hover .btn.btn-signin:focus {
  background-color: #26b7f0;
}

.btn.btn-signin:active {
  background-color: #00a0e0 !important;
}

#logo{
  width:200px;
  height:auto;
}

.is-invalid {
  font-size: 14px;
  font-weight: bold;
  color: #d93025;
}

.copyright {
  position: absolute;
  bottom: 0;
  font-size: 14px;
  color: #6c6c6c;
  text-align: center;
  width: 100%;
}


/* loading bar style */
.loading-logo {
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  width:300px;
  height:auto;
  padding-left: 0px;
  padding-bottom: 20px;
}

.loading-text {
  font-size: 24px;
}


@keyframes side2side {
  0%, 100% { transform: translateX(-50%); }
  50%      { transform: translateX(150%); }
}

.center {
  left: 50%;
  margin: 0;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

</style>
