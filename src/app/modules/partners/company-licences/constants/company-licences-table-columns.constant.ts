import { Column } from '@shared/components/generic-table/models/column.model';
import * as moment from 'moment';

export const CompanyLicenceTableColumns: Column[] = [
  {
    title: 'COMPANY_LICENCES.FIELDS.COMPANY_NAME',
    attributeName: 'companyName',
  },
  {
    title: 'COMPANY_LICENCES.FIELDS.LICENCE_NAME',
    attributeName: 'licenceName',
  },
  {
    title: 'COMPANY_LICENCES.FIELDS.START_DATE',
    attributeName: 'startDate',
    pipeArgs: (date: Date) => {
      return moment(date).format('DD/MM/YYYY');
    }
  },
  {
    title: 'COMPANY_LICENCES.FIELDS.END_DATE',
    attributeName: 'endDate',
    pipeArgs: (date: Date) => {
      return moment(date).format('DD/MM/YYYY');
    }
  }
];
