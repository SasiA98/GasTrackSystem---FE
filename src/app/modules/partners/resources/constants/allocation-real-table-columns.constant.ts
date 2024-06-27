import { Column } from '@shared/components/generic-table/models/column.model';
import { Resource } from '@shared/models/resource.model';
import { Project } from '@shared/models/project.model';

import * as moment from 'moment';

export const AllocationRealTableColumns: Column[] = [
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
    title: 'ALLOCATION.FIELDS.PERCENTAGE',
    attributeName: 'commitmentPercentage',
    pipeArgs: (percentage: number) => {
      // Verifica la parte decimale
      const decimalPart = percentage % 1;
      let roundedValue: number;
  
      // Arrotonda per eccesso se la parte decimale è maggiore o uguale a 0.6, altrimenti per difetto
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
