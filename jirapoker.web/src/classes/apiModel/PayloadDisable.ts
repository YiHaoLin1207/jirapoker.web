export default class PayloadDisable {
  public by: string;
  public ids: string[];

  constructor(fields?: { by?: string; ids?: string[] }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
