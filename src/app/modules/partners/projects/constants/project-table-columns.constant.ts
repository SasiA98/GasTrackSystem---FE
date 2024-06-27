import { Column } from '@shared/components/generic-table/models/column.model';
import { Resource } from '@shared/models/resource.model';
import { Project } from '@shared/models/project.model'
import * as moment from 'moment';
import { Allocation } from '@shared/models/allocation.model';
import { Role } from '@shared/enums/role.enum';

export const ProjectTableColumns: Column[] = [
  {
    title: 'PROJECTS.FIELDS.TITLE',
    attributeName: 'name'
  },
  {
    title: 'PROJECTS.FIELDS.INDUSTRY',
    attributeName: 'industry'
  },
  {
      title: 'PROJECTS.FIELDS.PRESALE',
      attributeName: 'presaleTrigram',
      accent: true
  },
  {
      title: 'PROJECTS.FIELDS.DUM',
      attributeName: 'dumTrigram',
      accent: true
  },
  {
    title: 'PROJECTS.FIELDS.BM',
    attributeName: 'bmTrigram',
    accent: true
  },
  {
      title: 'PROJECTS.FIELDS.PM',
      attributeName: 'pmTrigram',
      accent: true
  },
  {
    title: 'PROJECTS.FIELDS.ESTIMATED_COST',
    attributeName: 'currentEstimatedCost',
    pipeArgs: (cost: number) => {
        return cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' €';
      }
  },
  {
      title: 'PROJECTS.FIELDS.ACTUAL_COST',
      attributeName: 'actualCost',
      pipeArgs: (cost: number) => {
        return cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' €';
      }
    },
    {
        title: 'PROJECTS.FIELDS.STATUS',
        attributeName: 'status',
    },
];
