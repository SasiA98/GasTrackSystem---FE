import { Column } from '@shared/components/generic-table/models/column.model';
import { Resource } from '@shared/models/resource.model';
import * as moment from 'moment';

export const RealAllocationTableColumns: Column[] = [
  {
    title: 'ALLOCATION.FIELDS.RESOURCE',
    attributeName: 'resourceName',
  },
  {
    title: 'ALLOCATION.FIELDS.ROLE',
    attributeName: 'role',
    accent: true
  },
  {
    title: 'ALLOCATION.FIELDS.PERCENTAGE',
    attributeName: 'commitmentPercentage',
    pipeArgs: (percentage: number) => {
      const decimalPart = percentage % 1;
      let roundedValue: number;

      if (decimalPart >= 0.6) {
        roundedValue = Math.ceil(percentage);
      } else {
        roundedValue = Math.floor(percentage);
      }

      return roundedValue + ' %';
    }
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
