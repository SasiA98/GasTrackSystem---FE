import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { TableAction } from '@shared/components/generic-table/config/table-action';


export const OfficialtrigramTableAction : TableAction[] = [
  {
    operation: TableOperation.EDIT,
    title: 'BUTTONS.EDIT'
  },
  {
    operation: TableOperation.DELETE,
    title: 'BUTTONS.DELETE'
  }
];