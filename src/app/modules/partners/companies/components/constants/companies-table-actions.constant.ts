import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { TableAction } from '@shared/components/generic-table/config/table-action';


export const CompanyTableAction : TableAction[] = [
  {
    operation: TableOperation.SEND_EMAIL,
    title: 'BUTTONS.SEND_EMAIL'
  }
];