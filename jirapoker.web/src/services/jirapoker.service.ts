import { Issue } from '@/classes/apiModel';
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
  public async getTISIssuesInSprints(): Promise<Issue[]> {
    const url = '/api/CTIS/GetIssuesInSprints';
    const res: AxiosResponse<any> = await axios.get(url);
    return res.data;
  }
  public async getDIRIssuesInSprints(): Promise<Issue[]> {
    const url = '/api/DIR/GetIssuesInSprints';
    const res: AxiosResponse<any> = await axios.get(url);
    return res.data;
  }

}
