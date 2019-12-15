export default class IssueStatus {

    public issueKey: string;
    public isRevealed: boolean = false;

    constructor(fields?: {
      issueKey: string,
      isRevealed: boolean,
    }) {
      if (fields) {
          Object.assign(this, fields);
      }
    }
  }
