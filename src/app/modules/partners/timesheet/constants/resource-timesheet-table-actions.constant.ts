import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { TableAction } from '@shared/components/generic-table/config/table-action';


export const ResourceTimesheetTableActions : TableAction[] = [
   {
     operation: TableOperation.DETAIL,
     title: 'BUTTONS.DETAIL_PROJECT'
   },
  {
    operation: TableOperation.DELETE,
    title: 'BUTTONS.DELETE'
  }
];