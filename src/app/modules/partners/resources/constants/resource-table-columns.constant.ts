import { Column } from '@shared/components/generic-table/models/column.model';
import { Unit } from '@shared/models/unit.model';
import * as moment from 'moment';

export const ResourceTableColumns: Column[] = [
  {
    title: 'RESOURCES.FIELDS.NAME',
    attributeName: 'name'
  },
  {
    title: 'RESOURCES.FIELDS.SURNAME',
    attributeName: 'surname'
  },
  {
      title: 'RESOURCES.FIELDS.ROLES',
      attributeName: 'roles',
      accent: true,
      pipeArgs: (role: string[]) => {
        return role.join(' - ');
      }
    },
  {
    title: 'RESOURCES.FIELDS.SENIORITY',
    attributeName: 'hiringDate',
    pipeArgs: (date: Date) => {
      const today = moment();
      const hiringDate = moment(date);
      let months = today.diff(hiringDate, 'months');

      const years = Math.floor(months / 12);
      let remainingMonths = months % 12;

      if (remainingMonths === 0) {
        remainingMonths = remainingMonths + 1;
      }

      const totalSeniority = years + remainingMonths / 100;
      return totalSeniority.toFixed(2);
    },
    leaveicon: true
  },
  {
    title: 'RESOURCES.FIELDS.AGE',
    attributeName: 'birthDate',
    pipeArgs: (date: Date) => {
      const today = moment();
      const birthDate = moment(date);
      const months = today.diff(birthDate, 'months');

      const years = Math.floor(months / 12);
      let remainingMonths = months % 12;

      if (remainingMonths === 0) {
        remainingMonths = remainingMonths + 1;
      }

      const totalSeniority = years + remainingMonths / 100;
      return totalSeniority.toFixed(2);
    }
  },
  {
    title: 'RESOURCES.FIELDS.UNIT',
    attributeName: 'unit',
    accent: true,
    pipeArgs: (unit: Unit) => {
      return unit.trigram;
    }
  },
  {
    title: 'RESOURCES.FIELDS.HOURLYCOST',
    attributeName: 'currentHourlyCost',
    pipeArgs: (cost: number) => {
      return cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' €';
    }
  }
];
