<template>
  <div class="container-fluid content-wrapper">
    <br></br><br></br><br></br><br></br>
    <div class="container-fluid search-result-content" v-for="sprint in sprints" :key="sprint.sprintName">
      <div id=list-group class="list-group">
        <div class="content-title">
          {{ sprint.sprintName}}&emsp;<span class="badge badge-secondary">{{ sprint.issues.length }}&nbsp;issues</span>
        </div>
        <div v-for="issue in sprint.issues" :key="issue.issueKey">
          <button type="button" class="list-group-item list-group-item-action" v-if="issue.sprintName === sprint.sprintName">
            <a class="nav-item" :href="issue.Url">{{ issue.issueKey}}</a>&emsp;{{ issue.summary}}&emsp;<span class="badge badge-primary badge-pill">{{ issue.storyPoint}}</span>
          </button>
        </div>       
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Issue, Sprint } from '@/classes/apiModel';
import { JiraPokerService } from '@/services';

export default Vue.extend({
  name: 'JiraPoker', 
  components: {
  },
  data() {
    return {
      issues: [] as Issue[],
      sprints: [] as Sprint[],
    };
  },
  computed: {
  },
  methods: {
    setSprints(issues: Issue[]) {
      const vm = this;
      let sprintNames: string[] = [];
      issues.forEach(issue => {
        if (!sprintNames.includes(issue.sprintName)) {
          sprintNames.push(issue.sprintName)
          sprintNames.sort()
        };
      });
      sprintNames.forEach(sprintName => {
        let sprint = new Sprint({ sprintName: sprintName, issues: [] as any});
        this.sprints.push(sprint);
      });
      this.sprints.forEach(sprint => {
        issues.forEach((issue, index) => {
          if(issue.sprintName === sprint.sprintName) {
            sprint.issues.push(issue);
          };
        });
      });
    }
  },
  async mounted() {
  },

  async created() {
    const vm = this;
    const jiraPokerService = new JiraPokerService();
    let TISIssues: Issue[] = await jiraPokerService.getTISIssuesInSprints();
    let DIRIssues: Issue[] = await jiraPokerService.getDIRIssuesInSprints();
    vm.issues = TISIssues.concat(DIRIssues)
    this.setSprints(vm.issues);
  },
});
</script>

<style lang="less" scoped>
  .container-fluid.search-result-content {
    width: 137%;
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