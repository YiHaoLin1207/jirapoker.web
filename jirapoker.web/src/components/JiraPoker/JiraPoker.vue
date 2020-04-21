<template>
<div class="container-fluid content-wrapper">
  <br><br><br><br><br><br><br>
  <div class="container-fluid search-result-content">
    <div id=list-group class="list-group">
      <div id="estimation-field-wrapper" class="col-8" v-show="isShowEstimationSelectList">
        <Row type="flex">
          <div id="estimation-field">
            <div class="content-title" style="font-weight:800; color:black; font-size=24px;">
              {{ currentIssue.issueKey }}
              <a class="hideEstimationSectionButton" @click="hideEstimationSection"><i class="far fa-times-circle"></i></a>
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
              <clickableAvatar :user="estimationResult.user" @click="updateIssueByThisUser(estimationResult)"></clickableAvatar>
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
            <Button :disabled="currentIssue.isRevealed === true" 
            @click="insertIssueStatus({issueKey: currentIssue.issueKey, isRevealed: true})" 
            icon="ios-search">Watch Result</Button>
          </div>
          </Col>
          <Col span="1" :style="{'position': 'absolute', 'left': '150px'}" style="padding: 12px; padding-left: 0px">
          <div>
            <Button :disabled="currentIssue.isRevealed === false" 
            @click="deleteIssueEstimationResults(currentIssue.issueKey); deleteIssueStatus(currentIssue.issueKey);" icon="ios-backspace">Re-estimation</Button>
          </div>
          </Col>
        </Row>
      </div>
      <div class="filter-panel row">
        <div class="col-lg-2 col-md-3 col-sm-12"> issue keyword: </div>
        <Input class="col-md-4 col-md-5 col-sm-12" v-model="issueKeyword" placeholder='please enter exact jira issue key'/>
      </div>
      <Collapse simple v-model="currentActivatedPanel">
        <div v-for="sprint in computedSprints" :key="sprint.sprintName">
          <Panel :name="sprint.sprintName">
            <div class="content-title" style="display: inline-block;">
            {{ sprint.sprintName}} &nbsp;<span class="badge badge-secondary">{{ sprint.issues.length }}&nbsp;issues</span>
            </div>
            <div slot="content">
              <div v-for="issue in sprint.issues" :key="issue.issueKey">
                <button type="button" 
                        class="list-group-item list-group-item-action" 
                        v-if="issue.sprintName === sprint.sprintName" 
                        @click="setCurrentIssue({'issue': issue, 'accountId': user.accountId, 'statusName': 'isRevealed'});
                        isShowEstimationSelectList = true; 
                        isShowIssueDetail = true;">
                  <EvaluateStatus :estimated="user.estimatedIssueKeys[issue.issueKey]"></EvaluateStatus>
                  <img :src="issue.iconUrl" width="21px" height="21px"/>&nbsp;
                  <a class="nav-item" :href="issue.url" target="_blank">{{ issue.issueKey }}</a>&nbsp;{{ issue.summary }}
                  <storyPoint :point="issue.storyPoint"></storyPoint>
                </button>
              </div>
              <div style="text-align: center; padding-top: 15px;">
                <a class="toggle-features" @click="collapse(sprint.sprintName)" style="font-size: 28px;"> 
                  <i class="fas fa-caret-square-up"></i>
                </a>
              </div>
            </div>
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
import { StoryPoint, EvaluateStatus } from './components';
import clickableAvatar from './components/clickableAvatar.vue';
import { toastrCustom } from '@/modules/toastr.factory';
import { NoticeCustom } from '@/modules/notice.factory';
import { isNull } from '@/libs/util';

export default Vue.extend({
  name: 'JiraPoker', 
  components: {
    StoryPoint,
    EvaluateStatus,
    clickableAvatar,
  },
  data() {
    return {
      isShowEstimationSelectList: false,
      isShowIssueDetail: false,
      sprints: [] as Sprint[],
      // Change to all the value to string
      storyPoints: ['0', '0.5', '1', '2', '3', '5', '8', '13', '21', '34', '?'] as string[],
      currentActivatedPanel: [] as string[],
      issueKeyword: '' as string,
    };
  },
  computed: {
    ...mapGetters({
      user: 'user',
      currentIssue: 'currentIssue',
    }),
    computedSprints(): Sprint[]{
      const vm: any =this;
      if(!vm.issueKeyword){
        return vm.sprints;
      }
      let result: Sprint[] = [];
      result = vm.sprints.reduce((resultSprints: Sprint[], currentSprint: Sprint)=>{
        let issues = currentSprint.issues.filter((issue: Issue)=>{
          return issue.issueKey === vm.issueKeyword;
        })
        if( !isNull(issues)){
          return resultSprints.concat(new Sprint({ sprintName: currentSprint.sprintName, issues}));
        }
        return resultSprints;
      }, result);
      return result;
    }
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
    async updateIssueByThisUser(item: any){
      const vm = this;
      const jiraPokerService = new JiraPokerService();
      await jiraPokerService.updateStoryPoint(item.issueKey, +item.estimatedStoryPoint);
      NoticeCustom.info({
        title: 'Updated',
        desc: `story point of issue ${item.issueKey} has been updated as ${item.estimatedStoryPoint}`,
      }, 5);
    },
    collapse(target: string): void{
      const vm: any = this;
      const index = vm.currentActivatedPanel.indexOf(target, 0);
      if (index > -1) {
        vm.currentActivatedPanel.splice(index, 1);
      }
    },
    hideEstimationSection(){
      this.isShowEstimationSelectList = false;
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
    const vm: any = this;
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
    width: 100%;
    .form-control {
      position: relative;
      left: 3px;
      width: 70px;
      font-size: 15px;
    }
    #estimation-field-wrapper {
      .hideEstimationSectionButton{
          position: absolute;
          right: 1%;
          font-size: 28px;
      }
      position: absolute;
      top: 13%;
      overflow: hidden;
      z-index:10;
      padding: 0px 10px;
      border: 2px;
      border-style: dashed;
      background-size: 26px 26px;
      background-color: rgba(255, 255, 255);
      background-image: 
        linear-gradient( 45deg,
                         rgba(24, 150, 223, 0.3) 25%, transparent 25%, transparent 50%,
                         rgba(24, 150, 223, 0.3) 50%, 
                         rgba(24, 150, 223, 0.3) 75%, transparent 75%, transparent);
      }
    .list-group-item.list-group-item-action {
      width: 100%;
      font-size: 14px;
      display:block;
        .nav-item {
          color: #828282;
        }
    }
  }
</style>