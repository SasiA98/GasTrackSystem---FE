import { Column } from '@shared/components/generic-table/models/column.model';

import * as moment from 'moment';

export const AllocationSaleTableColumns: Column[] = [
  {
    title: 'ALLOCATION.FIELDS.PROJECT',
    attributeName: 'projectName',
  },
  {
    title: 'ALLOCATION.FIELDS.PROJECT_ROLE',
    attributeName: 'role',
    accent: true
  },
  {
    title: 'ALLOCATION.FIELDS.HOURS',
    attributeName: 'hours'
  },
  {
    title: 'ALLOCATION.FIELDS.START_DATE',
    attributeName: 'startDate',
    pipeArgs: (date: Date) => {
      return moment(date).format('DD/MM/YYYY');
    }
  },
  {
    title: 'ALLOCATION.FIELDS.END_DATE',
    attributeName: 'endDate',
    pipeArgs: (date: Date) => {
      return moment(date).format('DD/MM/YYYY');
    }
  }
];
