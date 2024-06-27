import { Column } from '@shared/components/generic-table/models/column.model';
import { Timesheet } from '@shared/models/timesheet.model';

export const UnitTimesheetTableColumns: Column[] = [
  {
    title: 'RESOURCES.FIELDS.UNIT',
    attributeName: 'unitTrigram',
  },
  {
    title: 'UNIT_TIMESHEET.FIELDS.NAME',
    attributeName: 'resourceName'
  },
  {
    title: 'UNIT_TIMESHEET.FIELDS.SURNAME',
    attributeName: 'resourceSurname'
  },
  {
    title: 'UNIT_TIMESHEET.FIELDS.REMAINING_HOURS',
    attributeName: 'remainingWorkHours'
  }
];
