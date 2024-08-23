import { Column } from '@shared/components/generic-table/models/column.model';
import { Unit } from '@shared/models/unit.model';
import * as moment from 'moment';

export const Resource2TableColumns: Column[] = [
  {
    title: 'RESOURCES.FIELDS.NAME',
    attributeName: 'name'
  },
  {
    title: 'RESOURCES.FIELDS.SURNAME',
    attributeName: 'surname'
  },
  {
    title: 'Seniority Client',
    attributeName: 'seniority',
  },
  {
    title: 'Age',
    attributeName: 'age',
  },
  {
    title: 'Unit',
    attributeName: 'unit',
  },
  {
    title: 'RESOURCES.FIELDS.HOURLYCOST',
    attributeName: 'lastHourlyCost',
    pipeArgs: (cost: number) => {
      return cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' €';
    }
  }
];
