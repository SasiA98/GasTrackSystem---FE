import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { TableAction } from '@shared/components/generic-table/config/table-action';


export const AllocationTableActions : TableAction[] = [
  {
    operation: TableOperation.DETAIL,
    title: 'BUTTONS.DETAIL'
  },
   {
     operation: TableOperation.EDIT,
     title: 'BUTTONS.EDIT'
   },
  {
    operation: TableOperation.DELETE,
    title: 'BUTTONS.DELETE'
  },
   {
     operation: TableOperation.CONVERT,
     title: 'BUTTONS.CONVERT'
   }
];
