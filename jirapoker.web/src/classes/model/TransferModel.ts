/**
 * TransferModel is for easily handling iview transfer component
 * @export
 * @class TransferModel
 */
export default class TransferModel {
  public selectedKeys: string[];

  constructor(fields?: {
    selectedKeys: string[],
  }) {
    if (fields) {
      this.selectedKeys = fields.selectedKeys;
    }
  }
  public render = (item: any): any => {
    return item.key;
  }
  public handleChange = (transferKeys: any): any => {
    this.selectedKeys = transferKeys;
  }
}
