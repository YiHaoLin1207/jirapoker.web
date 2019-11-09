import Vue from 'vue';
import { VtCheckbox, VtView } from '.';
import { ITableRow } from '@/classes/interface';

// Set the global variable to avoid TSLint error for accessing data in selectAll method (*sign*)
let tableDataGlobal: ITableRow[] = [];

export default Vue.extend({
  components: {
    VtCheckbox,
    VtView,
  },
  data() {
    const selectAll = (checked: boolean = false) => {
      const vm: any = this;

      // Update current page's all checkboxes' values
      for (const row of tableDataGlobal) {
        // Only update the data in the filtered table data (current pages)
        if ((vm.$refs.dataTable as any).filteredData.some((x: ITableRow) => x.id === row.id)) {
          row.selected = checked;
        }
      }

      // Enable/Disable buttons
      vm.isDisableEdit = true;
      vm.isDisableClone = true;
      vm.isDisableDelete = !checked;
    };

    return {
      isShowTable: false as boolean,
      isDisableEdit: true as boolean,
      isDisableClone: true as boolean,
      isDisableDelete: true as boolean,
      tableData: [] as ITableRow[],
      tableOptions: {
        filterable: false,
        clientMultiSorting: true,
        texts: {
          // See https://github.com/matfish2/vue-tables-2/blob/master/lib/config/defaults.js
          filter: '',
          filterPlaceholder: this.$t('text.search'),
          limit: this.$t('text.limitRecords') + ':',
          noResults: this.$t('text.emptyResult'),
        },
        perPage: 10,
        perPageValues: [10, 20, 30],
        columnsClasses: { selected: 'text-center', view: 'text-center' },
        headings: {
          id: 'ID',
          selected: (h: any) => {
            return  h('Checkbox', {
              attrs: {
                id: 'selectAllCheckbox',
                ref: 'selectAllCheckbox',
              },
              on: {
                'on-change' : (isChecked: boolean) => {
                  selectAll(isChecked);
                },
              },
              ref: 'selectAllCheckbox',
            });
          },
        },
        rowClassCallback(row: ITableRow) {
          return row.selected ? 'table-selected-background' : '';
        },
        templates: {
          selected: VtCheckbox,
          view: VtView,
        },
      },
    };
  },
  computed: {
    selectedRows(): ITableRow[] | null {
      if (!this.isShowTable) {
        return null;
      }
      const rows = this.$refs.dataTable ?
        (this.$refs.dataTable as any | null).filteredData.filter((x: ITableRow) => x.selected === true) : null;

      return rows;
    },
    selectedId(): string | number | null {
      if (this.selectedRows && this.selectedRows.length === 1) {
        return this.selectedRows[0].id || null;
      } else {
        return null;
      }
    },
  },
  watch: {
    tableData: (newVal, oldVal) => {
      tableDataGlobal = newVal;
    },
  },
  methods: {
    rowClicked(data: any) {
      const vm: any = this;
      if (data.row) {
        this.updateFunctionalButtons(data.row);
        const selectedRow: ITableRow = vm.tableData.find(
          (x: ITableRow) => x.id === data.row.id,
        );
        vm.tableOptions.rowClassCallback(selectedRow);
      }
    },
    updateFunctionalButtons(data: ITableRow | undefined) {
      const vm: any = this;
      if (data) {
        const row: ITableRow | undefined = vm.tableData.find(
          (x: ITableRow) => x.id === data.id,
        );

        if (row) {
          row.selected = !row.selected;
        }
      }

      // Update button disable's value
      vm.isDisableDelete = !vm.selectedRows || vm.selectedRows.length === 0;
      vm.isDisableEdit = !vm.selectedId;
      vm.isDisableClone = !vm.selectedId;
    },
    resetFunctionalButtons() {
      const vm: any = this;
      vm.isDisableDelete = true;
      vm.isDisableEdit = true;
      vm.isDisableClone = true;
    },
    search() {
      // TODO: Create reuse search method here!
    },
  },
  mounted() {
    const vm: any = this;
    /* Parent $on for vue-tables-2 child components */

    vm.$event.$on('vue-tables.checked', (row: ITableRow) => {
      // Do something
      vm.updateFunctionalButtons(row);
    });

    vm.$event.$on('vue-tables.view', (data: ITableRow) => {
      if (vm.viewCallback) {
        vm.viewCallback(data);
      }
    });
  },
  beforeDestroy() {
    const vm: any = this;
    vm.$event.$off('vue-tables.view');
    vm.$event.$off('vue-tables.checked');
  },
});
