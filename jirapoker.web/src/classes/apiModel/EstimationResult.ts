export default class EstimationResult {
  public issueKey: string;
  public userName: string;
  public estimatedStoryPoint: string;

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
