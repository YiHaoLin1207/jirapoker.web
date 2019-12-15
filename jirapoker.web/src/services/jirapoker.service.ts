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
   * InsertIssueEstimationResult
   *
   * @param payload: EstimationResult
   * @returns {Promise<any}
   * @memberof JiraPokerService
   */
  public async insertIssueEstimationResult(payload: EstimationResult): Promise<any> {
    const url = '/api/issue/estimation-result';
    const res: AxiosResponse<any> = await axios.post(url, payload);
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
   * getIssueEstimatedStoryPointByUser
   *
   * @param issueKey: string
   * @param userName: string
   * @returns {Promise<any}
   * @memberof JiraPokerService
   */
  public async getIssueEstimatedStoryPointByUser(issueKey: string, userName: string): Promise<string> {
    const url = `/api/issue/estimated-story-point/${issueKey}/${userName}`;
    const res: AxiosResponse<any> = await axios.get(url);
    return res.data;
  }

  /**
   * getUserEstimatedIssueKeys
   *
   * @param userName: string
   * @returns {Promise<string[]}
   * @memberof JiraPokerService
   */
  public async getUserEstimatedIssueKeys(userName: string): Promise<string[]> {
    const url = `/api/user/${userName}/estimated-issue-keys`;
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
}
