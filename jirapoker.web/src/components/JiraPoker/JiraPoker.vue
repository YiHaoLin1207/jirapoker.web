<template>
  <div class="container-fluid content-wrapper">
    <br><br><br>
    <div class="container-fluid search-result-content">
      <div id=list-group class="list-group">
        <div id="estimation-" v-show="isShowEstimationSelectList" style="position:fixed;top:5%;transform: translateY(200%);z-index: 999">
          <div class="estimation-sub-title">
          Estimation
          </div>
          <select id="inputState" class="form-control" v-model="currentIssue.currentEstimatedStoryPoint" @change="currentIssue.isEstimated = true; insertIssueEstimationResult(currentIssue.issueKey, user.userName, currentIssue.currentEstimatedStoryPoint)">
            <option selected>{{ currentIssue.currentEstimatedStoryPoint }}</option>
            <option v-for="storyPoint in storyPoints" v-show="currentIssue.currentEstimatedStoryPoint != storyPoint" :key="storyPoint" :value="storyPoint">{{ storyPoint }}</option>
          </select>
        </div>
        <div v-for="estimationResult in currentIssue.estimationResults" v-bind:key="estimationResult.userName">
          {{estimationResult}}
        </div>
        <div v-for="sprint in sprints" :key="sprint.sprintName">
          <div class="content-title">
            {{ sprint.sprintName}}&emsp;<span class="badge badge-secondary">{{ sprint.issues.length }}&nbsp;issues</span>
          </div>
          <div v-for="issue in sprint.issues" :key="issue.issueKey">
            <button type="button" class="list-group-item list-group-item-action" v-if="issue.sprintName === sprint.sprintName" @click="setCurrentIssue({'issue': issue, 'userName': user.userName}); isShowEstimationSelectList = true; isShowIssueDetail = true;">
              <a class="nav-item" :href="issue.url">{{ issue.issueKey }}</a>&emsp;{{ issue.summary}}&emsp;<span class="badge badge-success" v-show="issueIsEstimatedByUser(issue) | issue.isEstimated">Estimated</span><span class="badge badge-primary badge-pill">{{ issue.storyPoint }}</span>
            </button>
          </div>
          <br><br>
        </div>   
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Issue, Sprint, EstimationResult } from '@/classes/apiModel';
import { JiraPokerService } from '@/services';
import { UserProfile } from '../../classes/model';
import { mapGetters, mapMutations } from 'vuex';

export default Vue.extend({
  name: 'JiraPoker', 
  components: {
  },
  data() {
    return {
      isShowEstimationSelectList: false,
      isShowIssueDetail: false,
      sprints: [] as Sprint[],
      // Change to all the value to string
      storyPoints: ['0', '0.5', '1', '2', '3', '5', '8', '13', '21', '34', '?'] as string[],

    };
  },
  computed: {
    ...mapGetters({
      user: 'user',
      currentIssue: 'currentIssue',
    }),
  },
  methods: {
    ...mapMutations({
      setCurrentIssue: 'setCurrentIssue',
    }),
    issueIsEstimatedByUser(issue: Issue) {
        const vm = this;
        if (vm.user.estimatedIssueKeys.includes(issue.issueKey)) {
          issue.isEstimated = true;
          return true;
        }
        return false;
    },  
    async setUserEstimatedIssueKeys(userName: string) {
      const vm = this;
      const jiraPokerService = new JiraPokerService();
      let estimatedIssueKeys = await jiraPokerService.getUserEstimatedIssueKeys(userName);
      console.log(estimatedIssueKeys)
      console.log(estimatedIssueKeys)
      vm.user.estimatedIssueKeys = estimatedIssueKeys;
    }, 
    insertIssueEstimationResult(issueKey: string, userName: string, estimatedStoryPoint: string) {
      const estimationResult: EstimationResult = {issueKey, userName, estimatedStoryPoint};
      const jiraPokerService = new JiraPokerService();
      jiraPokerService.insertIssueEstimationResult(estimationResult);
    },
    async setSprints() {
      const vm = this;
      const jiraPokerService = new JiraPokerService();
      let sprints: Sprint[] = await jiraPokerService.getIssuesInActiveAndFutureSprints('product & DevOps Infra');
      vm.sprints = sprints;
    }
  },
  async mounted() {
    
  },

  async created() {
    const vm = this;
    vm.setSprints();
    vm.setUserEstimatedIssueKeys(vm.user.userName);
  },
  async updated() {
    console.log('updated')
  }
});
</script>

<style lang="less" scoped>
  .container-fluid.search-result-content {
    width: 137%;
    .form-control {
      width: 70px;
      font-size: 15px;
    }
    .estimation-sub-title {
      font-size: 15px;
    }
    .list-group-item.list-group-item-action {
      width: 70%;
      font-size: 13px;
      display:block;
        .nav-item {
          color: #828282;
        }        
        .badge.badge-primary.badge-pill {        
          position: absolute;
          right: 2%;
          width: 35px;
          background: #6c757d   
        }
    }
  }
</style>