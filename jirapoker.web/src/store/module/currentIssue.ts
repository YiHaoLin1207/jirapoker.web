import { EstimationResult, Issue } from '@/classes/apiModel';
import { JiraPokerService } from '@/services';

export default {
  state: {
    currentIssue: new Issue() as Issue,
  },
  getters: {
    currentIssue: (state: any) => state.currentIssue,
  },
  mutations: {
    SOCKET_ISSUEESTIMATIONRESULTS(state: any, results: EstimationResult[]) {
        state.currentIssue.estimationResults = results;
        state.currentIssue = new Issue(state.currentIssue);
        console.log(state.currentIssue.estimationResults)
    },
    async setCurrentIssue(state: any, issue: Issue) {
      const jiraPokerService = new JiraPokerService();
      issue.estimationResults = await jiraPokerService.getIssueEstimationResults(issue.issueKey);
      state.currentIssue = issue;
      console.log('123', state.currentIssue.estimationResults)
    },
  },
  actions: {
    },
};
