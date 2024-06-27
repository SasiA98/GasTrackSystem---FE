import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { TableAction } from '@shared/components/generic-table/config/table-action';


export const UserActionTableColumn : TableAction[] = [
  {
    operation: TableOperation.DETAIL,
    title: 'BUTTONS.EDIT_USER'
  },
  {
    operation: TableOperation.EDIT,
    title: 'BUTTONS.CHANGE_STATUS'
  },
  {
    operation: TableOperation.MANAGE,
    title: 'BUTTONS.RESET_PASSWORD'
  }
];