import MenuNodeMeta from './MenuNodeMeta';


/**
 * MenuNode is used to save/show Menus on template's left Sider.
 * Notice the id must follow the level-rules, such as 1, 1.1, 1.1.2 for making breadcrum
 * @export
 * @class MenuNode
 */
export default class MenuNode {
  public id: number;
  public name: string;
  public meta: MenuNodeMeta;
  public children: MenuNode[] = [];
  constructor(fields?: {
    id?: number,
    name?: string,
    meta?: MenuNodeMeta,
    children?: MenuNode[],
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
