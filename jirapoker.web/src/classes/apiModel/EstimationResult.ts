
export default class EstimationResult {
  public issueKey: string;
  public userName: string;
  public userAvatarUrl: string;
  public estimatedStoryPoint: any;

  constructor(fields?: {
    issueKey: string;
    userName: string;
    userAvatarUrl: string;
    estimatedStoryPoint: string;

  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
