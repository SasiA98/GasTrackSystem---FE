import { Column } from '@shared/components/generic-table/models/column.model';
import { Company } from '@shared/models/company.model';
import * as moment from 'moment';

export const CompanyLicenceTableColumns: Column[] = [
  {
    title: 'COMPANY_LICENCES.FIELDS.COMPANY_NAME',
    attributeName: 'company',
    pipeArgs: (company: Company) => {
      return company.name;
    }
  },
  {
    title: 'COMPANY_LICENCES.FIELDS.LICENCE_NAME',
    attributeName: 'licenceName',
  },
  {
    title: 'COMPANY_LICENCES.FIELDS.EXPIRY_DATE',
    attributeName: 'expiryDate',
    accent: true,
    pipeArgs: (date: Date) => {
      return moment(date).format('DD/MM/YYYY');
    }
  }
];
