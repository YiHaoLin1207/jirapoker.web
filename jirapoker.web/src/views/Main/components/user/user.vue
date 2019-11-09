<template>
  <div id="user-avatar" class="user-avatar-dropdown">
    <Dropdown trigger="click" @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Avatar :src="avatarImgPath" />
      </Badge>
      <Icon size="16" color="#9f9f9f" type="ios-arrow-down"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="userInfo">
          {{ $t('main.userInfo') }}<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>
        <DropdownItem name="signOut">{{ $t('main.signout') }}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <modal id="userInfoModal" footer-hide v-model="isShowModalUserInfo" :title="$t('main.userInfo')" @on-ok="isShowModalUserInfo=!isShowModalUserInfo"  ok-text="Ok">
      <table class="table borderless">
        <tbody>
          <tr>
            <td class="user-modal-title">{{ $t('main.userName') }}</td>
            <td class="user-modal">{{ user.name }}</td>
          </tr>
          <tr><td class="user-modal-title">{{ $t('main.userRoles') }}</td><td class="user-modal">{{ user.roles | flattenNames }}</td></tr>   
          <tr><td class="user-modal-title">{{ $t('main.userDataRoles') }}</td><td class="user-modal">-</td></tr>   
        </tbody> 
      </table>
       <div slot="footer">
      </div>
    </modal>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { Account } from '@/classes/apiModel';
import { AuthService } from '@/services';
import { toastrCustom } from '@/modules/toastr.factory';
import store from '@/store';
import './user.less';

export default Vue.extend({
  name: 'User',
  props: {
    messageUnreadCount: {
      type: Number as PropType<number>,
      default: 0,
    },
  },
  data() {
    return {
      isShowModalUserInfo: false as boolean,
    };
  },
  computed: {
    ...mapGetters({
      user: 'user',
      avatarImgPath: 'avatarImgPath',
    }),
  },
  methods: {
    ...mapActions({
      signOut: 'signOut',
    }),
    async logout() {
      const vm: any = this;
      try {
        await vm.signOut();
      } catch (err) {
        toastrCustom.error(err);
      } finally {
        vm.$router.replace({
          name: 'login',
        });
      }
    },
    handleClick(name: string): void {
      switch (name) {
        case 'userInfo':
          this.isShowModalUserInfo = true;
          break;
        case 'signOut':
          this.logout();
          break;
      }
    },
  },
});
</script>

<style lang="less" scoped>

.ivu-dropdown-menu > .ivu-dropdown-item{
    font-size: 14px !important;
    color: #4a4a4a;
}
</style>


