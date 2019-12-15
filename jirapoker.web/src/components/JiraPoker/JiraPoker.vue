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
                <select id="inputState" class="form-control" v-model="currentIssue.currentEstimatedStoryPoint" @change="currentIssue.isEstimated = true; insertIssueEstimationResult(currentIssue.issueKey, user.userName, user.avatarUrl, currentIssue.currentEstimatedStoryPoint)">
                  <option selected>{{ currentIssue.currentEstimatedStoryPoint }}</option>
                  <option v-for="storyPoint in storyPoints" v-show="currentIssue.currentEstimatedStoryPoint != storyPoint" :key="storyPoint" :value="storyPoint">{{ storyPoint }}</option>
                </select>
              </Col>      
              <Col span="1" :style="{'position': 'absolute', 'left': 90 + 50 * index + 'px'}" v-for="(estimationResult, index) in currentIssue.estimationResults" :key="estimationResult.userName">         
                <Badge v-if="currentIssue.isRevealed" :text="estimationResult.estimatedStoryPoint">
                  <Avatar :src="estimationResult.userAvatarUrl" />
                </Badge>
                <Badge v-else text="X">
                  <Avatar :src="estimationResult.userAvatarUrl" />
                </Badge>
              </Col>
            </div>
            </Row>
            <Row type="flex">
              <Col span="1" style="padding: 12px; padding-left: 0px">
                <div>
                  <Button @click="insertIssueStatus({issueKey: currentIssue.issueKey, isRevealed: true})" icon="ios-search">Watch Result</Button>
                </div>
              </Col>
              <Col span="1" :style="{'position': 'absolute', 'left': '150px'}" style="padding: 12px; padding-left: 0px">
                <div>
                <Button  @click="deleteIssueStatus(currentIssue.issueKey)" icon="ios-backspace">Re-estimation</Button>
                </div>
              </Col>
            </Row>
          </div>                
          <div v-for="sprint in sprints" :key="sprint.sprintName">
            <div class="content-title">
              {{ sprint.sprintName}}&emsp;<span class="badge badge-secondary">{{ sprint.issues.length }}&nbsp;issues</span>
            </div>
            <div v-for="issue in sprint.issues" :key="issue.issueKey">
              <button type="button" class="list-group-item list-group-item-action" v-if="issue.sprintName === sprint.sprintName" @click="setCurrentIssue({'issue': issue, 'userName': user.userName, 'statusName': 'isRevealed'}); isShowEstimationSelectList = true; isShowIssueDetail = true;">
                <Badge v-if="issueIsEstimatedByUser(issue) | issue.isEstimated" status="success" />
                <Badge v-else status="default" />
                <a class="nav-item" :href="issue.url">{{ issue.issueKey }}</a>&emsp;{{ issue.summary}}<span class="badge badge-primary badge-pill">{{ issue.storyPoint }}</span>
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
    insertIssueEstimationResult(issueKey: string, userName: string, userAvatarUrl: string, estimatedStoryPoint: string) {
      const estimationResult: EstimationResult = {issueKey, userName, userAvatarUrl, estimatedStoryPoint};
      const jiraPokerService = new JiraPokerService();
      jiraPokerService.insertIssueEstimationResult(estimationResult);
    },
    async insertIssueStatus(issueStatus: IssueStatus) {
      const vm = this;
      const jiraPokerService = new JiraPokerService();
      await jiraPokerService.insertIssueStatus(issueStatus);
    },
    async deleteIssueStatus(issueKey: string) {
      const vm = this;
      const jiraPokerService = new JiraPokerService();
      await jiraPokerService.deleteIssueStatus(issueKey);
    },
    async setUserEstimatedIssueKeys(userName: string) {
      const vm = this;
      const jiraPokerService = new JiraPokerService();
      let estimatedIssueKeys = await jiraPokerService.getUserEstimatedIssueKeys(userName);
      vm.user.estimatedIssueKeys = estimatedIssueKeys;
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
    #estimation-field-wrapper {
      position: absolute;
      top:18%;
      width: 80%;
      overflow: hidden;
      z-index:9998;
      .estimation-sub-title {
        font-size: 15px;
        position: relative;
        left: 1.5%;
      }
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