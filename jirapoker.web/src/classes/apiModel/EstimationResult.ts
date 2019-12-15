export default class EstimationResult {
  public issueKey: string;
  public userName: string;
  public estimatedStoryPoint: any;

  constructor(fields?: {
    issueKey: string;
    userName: string;
    estimatedStoryPoint: string;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
