<template>
  <div class="container">
    <div class="row">
      <div class="issue-point col-3">
            <Select v-model="currentIssue.currentEstimatedStoryPoint" @change="updateIssuePoint">
              <Option v-for="storyPoint in storyPoints" :key="storyPoint" :value="storyPoint" >{{ storyPoint }}</Option>
            </Select>
      </div>
      <div class="result-with-avatar col-9">
        <div v-for="(estimationResult, index) in currentIssue.estimationResults" :key="estimationResult.user.accountId">
          <Badge :text="estimationResult.estimatedStoryPoint">
            <clickable :user="estimationResult.user" @click="clickOnResult(estimationResult)"></clickable>
          </Badge>
        </div>
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
    currentIssue: {type: Object, default: ()=>{return { "isEstimated": false, "currentEstimatedStoryPoint": "0.5", "estimationResults": [ { "issueKey": "CTIS-2694", "estimatedStoryPoint": "0.5", "user": { "accountId": "5c4543cb29af5e218af276c1", "userName": "liminchien", "avatarUrl": "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/5c4543cb29af5e218af276c1/91015527-b108-42ff-823b-40500135ef86/128?size=48&s=48" } } ], "description": "as title\n\n*表徵：*\n\n# TxA 活著，GetToken正常\n# E2E不會過，ServiceSwitching can not get receipt\n# TxA 寫大量這個log\n{noformat}tag:transactionAdapter_docker \nlevel:DEBUG \nclass:Microsoft.Extensions.Http.DefaultHttpClientFactory \nmessage:Starting HttpMessageHandler cleanup cycle with 4 items [url: ] [action: ] \n@timestamp:May 21st 2020, 18:13:37.763 \n_id:cb65NnIBsPLEkUbvb9qI \n_type:logs \n_index:logstash-2020.05.21\n_score: -{noformat}\n\n!截圖 2020-05-21 下午7.05.38.png|width=1496,height=813!", "iconUrl": "https://cybersoft4u.atlassian.net/secure/viewavatar?size=medium&avatarId=10303&avatarType=issuetype", "issueKey": "CTIS-2694", "issueType": "Bug", "sprintName": "TIS 1.0 M10 S1", "storyPoint": 0, "summary": "[TxA] TxA Docker服務重起時可能會無法連線到TIS DB", "url": "https://cybersoft4u.atlassian.net/browse/CTIS-2694", "isRevealed": false }}},
  },
  data() {
    return {
      updateStoryPoint: ()=> {},
      storyPoints: StoryPoint.storyPoints,
      clickOnResult: ()=>{},
    };
  },
});
</script>
<style lang="less" scoped>
</style>
