import { Sprint } from '@/classes/apiModel';
import axios from '@/modules/axios.factory';
import { AxiosResponse } from 'axios';

export default class JiraPokerService {

  /**
   * getTISIssuesInSprints
   *
   * @param isNull
   * @returns {Promise<Issue[]>}
   * @memberof JiraPokerService
   */
  public async getIssuesInActiveAndFutureSprints(boardName: string): Promise<Sprint[]> {
    const url = `/api/IssuesInActiveAndFutureSprints/${boardName}`;
    const res: AxiosResponse<any> = await axios.get(url);
    return res.data;
  }
}
