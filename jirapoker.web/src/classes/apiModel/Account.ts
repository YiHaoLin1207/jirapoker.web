

export default class Account {

  public jiraUser: string; // Guid
  public jiraToken: string;

  constructor(fields?: {
    jiraUser: string,
    jiraToken: string,

  }) {
    if (fields) {
        Object.assign(this, fields);
    }
  }
}
