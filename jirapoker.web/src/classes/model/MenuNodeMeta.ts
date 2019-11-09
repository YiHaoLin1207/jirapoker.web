/**
 * MenuNode's metadata, including of
 * icon: can be font-awesome or iview Icon styles
 * title: title is used for knowing this menu node's meaning, not for displaying
 * hideInBread: is allowed to hide this node in breadcrum
 * @export
 * @class MenuNodeMeta
 */
export default class MenuNodeMeta {
  public icon: string;
  public title: string;
  public hideInBread: boolean = false;
  constructor(fields?: {
    icon?: string,
    title?: string,
    hideInBread?: boolean,
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
