enum EnumAction {
    Query = 1, // 查詢
    Create, // 新增
    Edit, // 編輯
    Remove, // 刪除
    Clone,  // 複製
    Download, // 下載
    Print, // 列印
}

export const EnumActionLocale = [
    'void', // void because enum start from 1
    'query', // 1
    'create', // 2
    'edit', // 3
    'remove', // 4
    'clone', // 5
    'download', // 6
    'print', // 7
];

export const actionLocale = (id: number): string => {
    return EnumActionLocale[id];
};

export default EnumAction;
