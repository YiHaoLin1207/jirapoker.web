<template>
  <div class="container">
    <div class="row">
      <div class="issue-point col-3">
            <Select v-model="currentIssue.currentEstimatedStoryPoint" @change="updateIssuePoint">
              <Option v-for="storyPoint in storyPoints" :key="storyPoint" :value="storyPoint" >{{ storyPoint }}</Option>
            </Select>
      </div>
      <div class="result-with-avatar col-9">
        Hello issue point
      </div>
    </div>
    <div class="row">
      <div class="watch-result-btn col-3">
        Hello issue point
      </div>
      <div class="re-estimate-btn col-3">
        Hello issue point
      </div>
      <div class="send-with-comment col-3">
        Hello issue point
      </div>
      <div class="send-with-comment-btn col-3">
        Hello issue point
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';
import { StoryPoint } from '@/classes/model/';
export default Vue.extend({
  name: 'JiraPoker', 
  props: {
    currentIssue: {type: Object, default: ()=>{return {}}},
  },
  data() {
    return {
      updateStoryPoint: ()=> {},
      storyPoints: StoryPoint.storyPoints,
    };
  },
});
</script>
<style lang="less" scoped>
</style>
