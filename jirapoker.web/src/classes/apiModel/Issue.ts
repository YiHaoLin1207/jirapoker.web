export default class Issue {

    public issueKey: string;
    public summary: string;
    public storyPoint: number;
    public description: string;
    public sprintName: string;
    public url: string;

    constructor(fields?: {
      issueKey: string,
      summary: string,
      storyPoint: number,
      description: string,
      sprintName: string,
      url: string,
    }) {
      if (fields) {
          Object.assign(this, fields);
      }
    }
  }
