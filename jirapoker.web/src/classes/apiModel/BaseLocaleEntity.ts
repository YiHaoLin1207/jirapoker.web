export default class BaseLocaleEntity {

  public name: string;
  public nameEn: string;
  public nameCn: string;

  constructor(fields?: {
    name?: Date,
    nameEn?: string,
    nameCn?: Date,
  }) {
    if (fields) {
        Object.assign(this, fields);
    }
  }
}
