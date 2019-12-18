import { EstimationResult, Issue, IssueStatus } from '@/classes/apiModel';
import { JiraPokerService } from '@/services';

export default {
  state: {
    currentIssue: new Issue() as Issue,
  },
  getters: {
    currentIssue: (state: any) => state.currentIssue,
  },
  mutations: {
    resetCurrentIssue(state: any, issueKey: string) {
      if (issueKey === state.currentIssue.issueKey) {
        state.currentIssue.estimationResults = [];
        state.currentIssue.currentEstimatedStoryPoint = '';
        state.currentIssue = new Issue(state.currentIssue);
      }
    },
    updateCurrentIssueEstimationResults(state: any, results: EstimationResult[]) {
      state.currentIssue.estimationResults = results;
      state.currentIssue = new Issue(state.currentIssue);
    },
    updateCurrentIssueStatus(state: any, issueStatus: IssueStatus) {
      if (issueStatus.issueKey === state.currentIssue.issueKey) {
        state.currentIssue.isRevealed = issueStatus.isRevealed;
        state.currentIssue = new Issue(state.currentIssue);
      }
    },
    resetCurrentIssueStatus(state: any, issueKey: string) {
      if (issueKey === state.currentIssue.issueKey) {
        state.currentIssue.isRevealed = false;
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
