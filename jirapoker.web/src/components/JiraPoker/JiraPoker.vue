<template>
<div class="container-fluid content-wrapper">
  <br><br><br><br><br><br><br>
  <div class="container-fluid search-result-content">
    <div id=list-group class="list-group">
      <div id="estimation-field-wrapper" v-show="isShowEstimationSelectList">
        <Row type="flex">
          <div id="estimation-field">
            <div class="content-title">
              {{ currentIssue.issueKey }}
            </div>
            <Col span="1">
            <select v-if="currentIssue.isRevealed===false" id="inputState" class="form-control" v-model="currentIssue.currentEstimatedStoryPoint" @change="insertIssueEstimationResult(currentIssue.issueKey, user.accountId, currentIssue.currentEstimatedStoryPoint)">
              <option selected>{{ currentIssue.currentEstimatedStoryPoint }}</option>
              <option v-for="storyPoint in storyPoints" v-show="currentIssue.currentEstimatedStoryPoint != storyPoint" :key="storyPoint" :value="storyPoint">{{ storyPoint }}</option>
            </select>
            <select v-else id="inputState" class="form-control" :disabled="true">
            </select>
            </Col>
            <Col span="1" :style="{'position': 'absolute', 'left': 90 + 50 * index + 'px'}" v-for="(estimationResult, index) in currentIssue.estimationResults" :key="estimationResult.user.accountId">
            <Badge v-if="currentIssue.isRevealed" :text="estimationResult.estimatedStoryPoint">
              <Tooltip :content="estimationResult.user.userName" placement="bottom">
                <Avatar :src="estimationResult.user.avatarUrl" />
              </Tooltip>
            </Badge>
            <Badge v-else text="OK">
              <Tooltip :content="estimationResult.user.userName" placement="bottom">
                <Avatar :src="estimationResult.user.avatarUrl" />
              </Tooltip>
            </Badge>
            </Col>
          </div>
        </Row>
        <Row type="flex">
          <Col span="1" style="padding: 12px; padding-left: 3px">
          <div>
            <Button :disabled="currentIssue.isRevealed === true" @click="insertIssueStatus({issueKey: currentIssue.issueKey, isRevealed: true})" icon="ios-search">Watch Result</Button>
          </div>
          </Col>
          <Col span="1" :style="{'position': 'absolute', 'left': '150px'}" style="padding: 12px; padding-left: 0px">
          <div>
            <Button :disabled="currentIssue.isRevealed === false" @click="deleteIssueEstimationResults(currentIssue.issueKey); deleteIssueStatus(currentIssue.issueKey);" icon="ios-backspace">Re-estimation</Button>
          </div>
          </Col>
        </Row>
      </div>
      <Collapse simple v-model="currentActivatedPanel">
        <div v-for="sprint in sprints" :key="sprint.sprintName">
          <Panel :name="sprint.sprintName">
            <div class="content-title" style="display: inline-block;">
            {{ sprint.sprintName}}&emsp;<span class="badge badge-secondary">{{ sprint.issues.length }}&nbsp;issues</span>
            </div>
            <div slot="content">
              <div v-for="issue in sprint.issues" :key="issue.issueKey">
                <button type="button" class="list-group-item list-group-item-action" v-if="issue.sprintName === sprint.sprintName" @click="setCurrentIssue({'issue': issue, 'accountId': user.accountId, 'statusName': 'isRevealed'}); isShowEstimationSelectList = true; isShowIssueDetail = true;">
                  <Badge v-if="user.estimatedIssueKeys[issue.issueKey]" status="success" />
                  <Badge v-else status="default" />
                  <a class="nav-item" :href="issue.url" target="_blank">{{ issue.issueKey }}</a>&emsp;{{ issue.summary}}<span class="badge badge-primary badge-pill">{{ issue.storyPoint }}</span>
                </button>
              </div>
              <a class="custom toggle-features" @click="collapse(sprint.sprintName)"> collapse </a>
            </div>
            <br><br>
          </Panel>
        </div>
      </Collapse>
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
import { IssueStatus } from '../../classes/apiModel';

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
      currentActivatedPanel: [] as string[],
    };
  },
  computed: {
    ...mapGetters({
      user: 'user',
      currentIssue: 'currentIssue',
    }),
  },
  sockets: {
    ...mapMutations({
      resetCurrentIssue: 'resetCurrentIssue',
      resetUserEstimatedIssueKey: 'resetUserEstimatedIssueKey',
      updateCurrentIssueEstimationResults: 'updateCurrentIssueEstimationResults',
      updateCurrentIssueStatus: 'updateCurrentIssueStatus',
      resetCurrentIssueStatus: 'resetCurrentIssueStatus',
      updateUserEstimatedIssueKey: 'updateUserEstimatedIssueKey',
    }),
  },
  methods: {
    ...mapMutations({
      setCurrentIssue: 'setCurrentIssue',
      setUserEstimatedIssueKeys: 'setUserEstimatedIssueKeys',
    }),
    collapse(target: string): void{
      const vm: any = this;
      const index = vm.currentActivatedPanel.indexOf(target, 0);
      if (index > -1) {
        vm.currentActivatedPanel.splice(index, 1);
      }
    },
    async insertIssueEstimationResult(issueKey: string, accountId: string, estimatedStoryPoint: string) {
      const vm = this;
      const jiraPokerService = new JiraPokerService();
      await jiraPokerService.insertIssueEstimationResult(issueKey, accountId, estimatedStoryPoint);
      vm.$socket.client.emit('insertIssueEstimationResult', issueKey);
    },
    async insertIssueStatus(issueStatus: IssueStatus) {
      const vm = this;
      const jiraPokerService = new JiraPokerService();
      await jiraPokerService.insertIssueStatus(issueStatus);
      vm.$socket.client.emit('insertIssueStatus', issueStatus);
    },
    async deleteIssueStatus(issueKey: string) {
      const vm = this;
      const jiraPokerService = new JiraPokerService();
      await jiraPokerService.deleteIssueStatus(issueKey);
      vm.$socket.client.emit('deleteIssueStatus', issueKey);
    },
    async deleteIssueEstimationResults(issueKey: string) {
      const vm = this;
      const jiraPokerService = new JiraPokerService();
      await jiraPokerService.deleteIssueEstimationResults(issueKey);
      vm.$socket.client.emit('deleteIssueEstimationResults', issueKey);
    },
    async setSprints() {
      const vm = this;
      const jiraPokerService = new JiraPokerService();
      let sprints: Sprint[] = await jiraPokerService.getIssuesInActiveAndFutureSprints('product & DevOps Infra');
      vm.sprints = sprints;
    }
  },
  async created() {
    const vm = this;
    vm.setUserEstimatedIssueKeys(vm.user.accountId);
    vm.setSprints();    
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
      position: relative;
      left: 3px;
      width: 70px;
      font-size: 15px;
    }
    #estimation-field-wrapper {
      position: absolute;
      top:18%;
      width: 80%;
      overflow: hidden;
      z-index:10;
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