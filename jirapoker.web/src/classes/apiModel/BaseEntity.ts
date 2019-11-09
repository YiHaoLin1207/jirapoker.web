
export default class BaseEntity {

  public createOn: Date;
  public createBy: string;
  public updateOn: Date;
  public updateBy: string;
  public removeOn: Date;
  public removeBy: string;

  constructor(fields?: {
    createOn?: Date,
    createBy?: string,
    updateOn?: Date,
    updateBy?: string,
    removeOn?: Date,
    removeBy?: string,
  }) {
    if (fields) {
        Object.assign(this, fields);
    }
  }
}
