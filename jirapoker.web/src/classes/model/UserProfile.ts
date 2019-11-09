/**
 * User Profile for current signin user
 * @export
 * @class UserProfile
 */
export default class UserProfile {
  public accountId: string;
  public userName: string;
  public avatarUrl: string;

  constructor(fields?: {
    accountId?: string,
    userName?: string,
    avatarUrl?: string,
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
