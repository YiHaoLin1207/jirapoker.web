export default class Issue {

    public issueKey: string;
    public summary: string;
    public storyPoint: number;
    public description: string;
    public sprintName: string;
    public estimatedStoryPoint: any;
    public isEstimated: boolean = false;
    public url: string;

    constructor(fields?: {
      issueKey: string,
      summary: string,
      storyPoint: number,
      description: string,
      sprintName: string,
      estimatedStoryPoint?: number;
      isEstimated: boolean;
      url: string,
    }) {
      if (fields) {
          Object.assign(this, fields);
      }
    }
  }
