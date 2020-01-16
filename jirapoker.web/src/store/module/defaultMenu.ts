import MenuNode from '@/classes/model/MenuNode';
import MenuNodeMeta from '@/classes/model/MenuNodeMeta';

const HOME_MENU: MenuNode = new MenuNode({
  id: 1,
  name: 'home',
  meta: new MenuNodeMeta({
    icon: 'fas fa-home',
    title: '首頁',
  }),
});

const MENUS: MenuNode[] = [
    {
      id: 100,
      name: 'jira-poker',
      meta: new MenuNodeMeta({ icon: 'fas fa-sort-numeric-up', title: '估點' }),
      children: [] as MenuNode[],
    },
  ];

export default {
    /**
     * @description default menu
     */
    MENUS,

    /**
     * @description default home menu
     */
    HOME_MENU,

};
export const getPageNameById = (id: number): string => {
    const pageStr = id.toString();
    let pos = 0;
    let currentNode: MenuNode = new MenuNode( HOME_MENU );
    currentNode.children = MENUS;
    while (pageStr.charAt(pos) !== '0') {
        const index = currentNode.children.findIndex((w: MenuNode): boolean => w.id.toString().charAt(pos) === pageStr.charAt(pos));
        currentNode = currentNode.children[index];
        pos++;
    }
    return currentNode.name;
};
