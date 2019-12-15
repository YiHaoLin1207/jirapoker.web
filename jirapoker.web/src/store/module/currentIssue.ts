import { EstimationResult, Issue, IssueStatus } from '@/classes/apiModel';
import { JiraPokerService } from '@/services';
import { stringify } from 'querystring';

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
        // This implementation should be fixed in the future to make Vue can watch its modification automatically
        state.currentIssue = new Issue(state.currentIssue);
    },
    SOCKET_ISSUESTATUS(state: any, issueStatus: IssueStatus) {
      if (issueStatus.issueKey === state.currentIssue.issueKey) {
        state.currentIssue.isRevealed = issueStatus.isRevealed;
        // This implementation should be fixed in the future to make Vue can watch its modifica
        state.currentIssue = new Issue(state.currentIssue);
      }
    },
    async setCurrentIssue(state: any, payload: any) {
      if (payload.issue !== undefined && payload.userName !== undefined && payload.statusName !== undefined) {
        const jiraPokerService = new JiraPokerService();
        payload.issue.estimationResults = await jiraPokerService.getIssueEstimationResults(payload.issue.issueKey);
        payload.issue.currentEstimatedStoryPoint = await jiraPokerService.getIssueEstimatedStoryPointByUser(payload.issue.issueKey, payload.userName);
        const issueRevealedStatus = await jiraPokerService.getIssueStatus(payload.issue.issueKey, payload.statusName);
        state.currentIssue = payload.issue;
        state.currentIssue.isRevealed = issueRevealedStatus;
      }
    },
  },
  actions: {
  },
};
