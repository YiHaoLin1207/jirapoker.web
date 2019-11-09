import { Issue } from '.';

export default class Sprint {

    public sprintName: string;
    public issues: any[];

    constructor(fields: {
      sprintName: string,
      issues: any[],
    }) {
      if (fields) {
          Object.assign(this, fields);
      }
    }
  }
