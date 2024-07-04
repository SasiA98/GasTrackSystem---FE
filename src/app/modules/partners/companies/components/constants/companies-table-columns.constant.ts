import { Column } from '@shared/components/generic-table/models/column.model';
import * as moment from 'moment';

export const CompanyTableColumns: Column[] = [
  {
    title: 'COMPANIES.FIELDS.NAME',
    attributeName: 'name',
  },
  {
    title: 'COMPANIES.FIELDS.EMAIL',
    attributeName: 'email',
  }
];
