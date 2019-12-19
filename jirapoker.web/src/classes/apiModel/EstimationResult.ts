
import { UserProfile } from '@/classes/model';

export default class EstimationResult {
  public issueKey: string;
  public user: UserProfile;
  public estimatedStoryPoint: any;

  constructor(fields?: {
    issueKey: string;
    user: UserProfile;
    estimatedStoryPoint: string;

  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
