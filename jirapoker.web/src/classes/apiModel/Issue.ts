import { EstimationResult } from '@/classes/apiModel';

export default class Issue {

    public issueKey: string;
    public iconUrl: string;
    public issueType: string;
    public summary: string;
    public storyPoint: number;
    public description: string;
    public sprintName: string;
    public isEstimated: boolean = false;
    public currentEstimatedStoryPoint: string = '';
    public estimationResults: EstimationResult[] = [];
    public url: string;

    constructor(fields?: {
      issueKey?: string,
      summary?: string,
      iconUrl?: string,
      issueType?: string,
      storyPoint?: number,
      description?: string,
      sprintName?: string,
      isEstimated?: boolean,
      currentEstimatedStoryPoint?: string,
      estimationResults?: EstimationResult[],
      url?: string,
    }) {
      if (fields) {
          Object.assign(this, fields);
      }
    }
  }
