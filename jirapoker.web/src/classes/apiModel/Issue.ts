import { EstimationResult } from '@/classes/apiModel';

export default class Issue {

    public issueKey: string;
    public summary: string;
    public storyPoint: number;
    public description: string;
    public sprintName: string;
    public isEstimated: boolean = false;
    public estimationResults: EstimationResult[] | any;
    public url: string;

    constructor(fields?: {
      issueKey: string,
      summary: string,
      storyPoint: number,
      description: string,
      sprintName: string,
      estimatedStoryPoint?: any;
      isEstimated: boolean;
      estimationResults?: EstimationResult[] | any;
      url: string,
    }) {
      if (fields) {
          Object.assign(this, fields);
      }
    }
  }
