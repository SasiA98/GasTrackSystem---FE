import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { TableAction } from '@shared/components/generic-table/config/table-action';


export const CompanyLicenceTableAction : TableAction[] = [
  {
    operation: TableOperation.DOWNLOAD,
    title: 'BUTTONS.DOWNLOAD'
  },
  {
    operation: TableOperation.UPLOAD,
    title: 'BUTTONS.UPLOAD'
  },
  {
    operation: TableOperation.SEND_EMAIL,
    title: 'BUTTONS.SEND_EMAIL'
  }
];