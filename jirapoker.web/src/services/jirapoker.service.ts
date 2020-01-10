import { UserProfile } from '@/classes/model';
import { Sprint, EstimationResult, IssueStatus } from '@/classes/apiModel';
import axios from '@/modules/axios.factory';
import { AxiosResponse } from 'axios';

export default class JiraPokerService {

  /**
   * getIssuesInActiveAndFutureSprints
   *
   * @param boardName: string
   * @returns {Promise<Sprint[]>}
   * @memberof JiraPokerService
   */
  public async getIssuesInActiveAndFutureSprints(boardName: string): Promise<Sprint[]> {
    const url = `/api/issue/${boardName}/active-and-future-sprints`;
    const res: AxiosResponse<any> = await axios.get(url);
    return res.data;
  }

  /**
   * UpdateStoryPoint
   *
   * @param issueKey: string
   * @param storyPoint: string
   * @returns {Promise<any}
   * @memberof JiraPokerService
   */
  public async updateStoryPoint(issueKey: string, storyPoint: number): Promise<any> {
    const url = '/api/issue/story-point';
    console.log({issueKey, storyPoint});
    const res: AxiosResponse<any> = await axios.put(url, {issueKey, storyPoint});
    return res;
  }

  /**
   * InsertIssueEstimationResult
   *
   * @param issueKey: string
   * @param accountId: string
   * @param estimatedStoryPoint: string
   * @returns {Promise<any}
   * @memberof JiraPokerService
   */
  public async insertIssueEstimationResult(issueKey: string, accountId: string, estimatedStoryPoint: string): Promise<any> {
    const url = '/api/issue/estimation-result';
    const res: AxiosResponse<any> = await axios.post(url, {issueKey, accountId, estimatedStoryPoint});
    return res;
  }

  /**
   * GetIssueEstimationResults
   *
   * @param issueKey: string
   * @returns {Promise<any}
   * @memberof JiraPokerService
   */
  public async getIssueEstimationResults(issueKey: string): Promise<EstimationResult[] | []> {
    const url = `/api/issue/${issueKey}/estimation-results`;
    const res: AxiosResponse<any> = await axios.get(url);
    return res.data;
  }

  /**
   * deleteIssueEstimationResults
   *
   * @param issueKey: string
   * @returns {Promise<boolean}
   * @memberof JiraPokerService
   */
  public async deleteIssueEstimationResults(issueKey: string): Promise<any> {
    const url = `/api/issue/${issueKey}/estimation-results`;
    const res: AxiosResponse<any> = await axios.delete(url);
    return res;
  }

  /**
   * getIssueEstimatedStoryPointByUser
   *
   * @param issueKey: string
   * @param accountId: string
   * @returns {Promise<any}
   * @memberof JiraPokerService
   */
  public async getIssueEstimatedStoryPointByUser(issueKey: string, accountId: string): Promise<string> {
    const url = `/api/issue/estimated-story-point/${issueKey}/${accountId}`;
    const res: AxiosResponse<any> = await axios.get(url);
    return res.data;
  }

  /**
   * getUserEstimatedIssueKeys
   *
   * @param accountId: string
   * @returns {Promise<string[]}
   * @memberof JiraPokerService
   */
  public async getUserEstimatedIssueKeys(accountId: string): Promise<string[]> {
    const url = `/api/user/${accountId}/estimated-issue-keys`;
    const res: AxiosResponse<any> = await axios.get(url);
    return res.data;
  }

  /**
   * insetIssueStatus
   *
   * @param payload: IssueStatus
   * @returns {Promise<any}
   * @memberof JiraPokerService
   */
  public async insertIssueStatus(payload: IssueStatus): Promise<any> {
    const url = `/api/issue/status`;
    const res: AxiosResponse<any> = await axios.post(url, payload);
    return res;
  }

  /**
   * getIssueStatus
   *
   * @param issueKey: string
   * @param statusName: string
   * @returns {Promise<boolean}
   * @memberof JiraPokerService
   */
  public async getIssueStatus(issueKey: string, statusName: string): Promise<boolean> {
    const url = `/api/issue/${issueKey}/status/${statusName}`;
    const res: AxiosResponse<any> = await axios.get(url);
    return res.data;
  }

  /**
   * deleteIssueStatus
   *
   * @param issueKey: string
   * @returns {Promise<boolean></boolean>}
   * @memberof JiraPokerService
   */
  public async deleteIssueStatus(issueKey: string): Promise<any> {
    const url = `/api/issue/${issueKey}/status`;
    const res: AxiosResponse<any> = await axios.delete(url);
    return res;
  }

  /**
   * getUserProfile
   *
   * @param accountId: string
   * @returns {Promise<UserProfile>}
   * @memberof JiraPokerService
   */
  public async getUserProfile(accountId: string): Promise<UserProfile> {
    const url = `/api/user-profile/${accountId}`;
    const res: AxiosResponse<any> = await axios.get(url);
    return res.data;
  }
}
