<template>
<div class="new-game-wrapper">
  <div class="container-fluid content-wrapper">
    <div class="container-fluid content">
      <div class="content-title">
        Start a new game
      </div>

      <div class="container-fluid new-game-form">
        <div class="row">
          <div class="col-xl-6 col-xs-12">
            <label> Story title: </label>
            <Input v-model="title" />
            <label> Story comment: </label>
            <Input v-model="comment" type="textarea" rows="5" /></div>
          <div class="col-xl-6 col-xs-12 new-game-result">
            <div>
              <Button @click="renderUrl"> Get Game URL </Button></div>
            <div> <a :href="url">{{url}}</a> </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'NewGame',
  data() {
    return {
      title: '' as string,
      comment: '' as string,
      url: '' as string,
    };
  },
  methods: {
    renderUrl() {
      const vm: any = this;
      const uri = window.location.origin + '/zh-tw/jira-poker/single/' + vm.title + '?comment=' + vm.comment;
      vm.url = encodeURI(uri);
    },
  }
});
</script>

<style lang="less" scoped>
.new-game-result {
  div {
    padding-top: 2em;
  }
}
</style>
