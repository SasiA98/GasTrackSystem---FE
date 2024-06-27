import { Column } from '@shared/components/generic-table/models/column.model';
export const TimesheetTableColumns: Column[] = [
  {
    title: 'TIMESHEET.FIELDS.PROJECT',
    attributeName: 'name'
  },
  {
    title: 'TIMESHEET.FIELDS.ESTIMATED_COST',
    attributeName: 'estimatedHrCost',
     pipeArgs: (cost: number) => {
       return cost + ' €';
     }
  },
  {
    title: 'TIMESHEET.FIELDS.ACTUAL_COST',
    attributeName: 'actualHrCost',
    pipeArgs: (cost: number) => {
      return cost + ' €';
    }
  },
  {
    title: 'TIMESHEET.FIELDS.PROPOSED_HOURS',
    attributeName: 'proposedWorkHours'
  },
  {
    title: 'TIMESHEET.FIELDS.ALLOCATION_HOURS',
    attributeName: 'allocationHours'
  },
  {
    title: 'TIMESHEET.FIELDS.HOURS',
    attributeName: 'hours',
    editable: true,
    icon: 'edit',
    isEnabled: true,
    number: true,
    verifiedHours: false
  },
  {
    title: 'TIMESHEET.FIELDS.COST',
    attributeName: 'cost',
     pipeArgs: (cost: number) => {
       return cost + ' €';
     }
  },
  {
    title: 'TIMESHEET.FIELDS.NOTE',
    attributeName: 'note',
    editable: true,
    icon: 'edit',
    isEnabled: true
  }
];
