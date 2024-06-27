import { Column } from '@shared/components/generic-table/models/column.model';
import * as moment from 'moment';

export const UnitTableColumns: Column[] = [
  {
    title: 'UNITS.FIELDS.TRIGRAM',
    attributeName: 'trigram',
    accent: true
  },
  {
    title: 'UNITS.FIELDS.TYPE',
    attributeName: 'type'
  },
  {
    title: 'UNITS.FIELDS.STATUS',
    attributeName: 'status'
  }
];
