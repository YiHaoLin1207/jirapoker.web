import { Issue } from '@/classes/apiModel';
/**
 * User Profile for current signin user
 * @export
 * @class UserProfile
 */
export default class UserProfile {
  public accountId: string;
  public userName: string;
  public avatarUrl: string;
  public estimatedIssueKeys: string[] = [];

  constructor(fields?: {
    accountId?: string,
    userName?: string,
    avatarUrl?: string,
    estimatedIssueKeys?: string[];
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
