export default class EstimationResult {
  public issueKey: string;
  public userName: string;
  public estimatedStoryPoint: any;

  constructor(fields?: {
    issueKey: string;
    userName: string;
    estimatedStoryPoint: any;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
