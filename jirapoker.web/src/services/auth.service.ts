import { Account } from '@/classes/apiModel';
import axios from '@/modules/axios.factory';
import { AxiosResponse } from 'axios';

export default class AuthService {

  /**
   * Sign In
   *
   * @param {Account} account
   * @returns {Promise<any>}
   * @memberof AccountService
   */
  public async signInAsync(account: Account): Promise<any> {
    const url = '/api/auth/SignIn';
    const res: AxiosResponse<any> = await axios.post(url, account);
    return res.data;
  }


  /**
   * Sign Out
   *
   * @param {string} id
   * @returns {Promise<any>}
   * @memberof AccountService
   */
  public async signOutAsync(id: string): Promise<any> {
    if (!id) {
      return;
    }

    const url = `api/Auth/SignOut/${id}`;
    const res: AxiosResponse<any> = await axios.put(url);
    return res;
  }

  /**
   * Get User
   *
   * @returns {Promise<any>}
   * @memberof AccountService
   */
  public async getUserAsync(): Promise<any> {
    const url = '';
    const res: AxiosResponse<any> = await axios.get(url);
    return res.data;
  }
}
