import { Column } from '@shared/components/generic-table/models/column.model';
import { Company } from '@shared/models/company.model';
import { Licence } from '@shared/models/licence.model';
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
    attributeName: 'licence',
    pipeArgs: (licence: Licence) => {
      return licence.name;
    }
  },
  {
    title: 'COMPANY_LICENCES.FIELDS.EXPIRY_DATE',
    attributeName: 'expiryDate',
    accent: true,
    pipeArgs: (date: Date) => {
      const year = moment(date).year();
    
      if (year === 2100) 
        return 'nessuna';
      else 
        return moment(date).format('DD/MM/YYYY');
    }
  },
  {
    title: 'COMPANY_LICENCES.FIELDS.EMAIL_SENT',
    attributeName: 'isEmailSent'
  },
];
