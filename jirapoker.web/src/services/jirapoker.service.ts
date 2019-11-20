import { Sprint, EstimationResult } from '@/classes/apiModel';
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
    const url = `/api/IssuesInActiveAndFutureSprints/${boardName}`;
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
    const url = '/api/InsertIssueEstimationResult';
    const res: AxiosResponse<any> = await axios.post(url, payload);
    return res;
  }
}
