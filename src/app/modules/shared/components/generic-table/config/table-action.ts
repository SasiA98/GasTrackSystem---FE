import { TableOperation } from '@shared/components/generic-table/config/table-operation';
import { Column } from '@shared/components/generic-table/models/column.model';

export type TableAction = {
  operation: TableOperation;
  title: string;
};
