import { EstimationResult, Issue } from '@/classes/apiModel';
import { JiraPokerService } from '@/services';

export default {
  state: {
    currentIssue: new Issue() as Issue,
    qq: 'a' as string,
  },
  getters: {
    currentIssue: (state: any) => state.currentIssue,
    qq: (state: any) => state.qq,
  },
  mutations: {
    SOCKET_ISSUEESTIMATIONRESULTS(state: any, results: EstimationResult[]) {
        state.currentIssue.estimationResults = results;

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
