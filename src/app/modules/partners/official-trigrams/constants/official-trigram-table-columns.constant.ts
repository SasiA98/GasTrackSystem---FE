import { Column } from '@shared/components/generic-table/models/column.model';

export const OfficalTrigramsTableColumns: Column[] = [
  {
    title: 'OFFICIAL_TRIGRAMS.FIELDS.LEGAL_ENTITY',
    attributeName: 'legalEntity',
  },
  {
    title: 'OFFICIAL_TRIGRAMS.FIELDS.INDUSTRY',
    attributeName: 'industry',
  },
  {
    title: 'OFFICIAL_TRIGRAMS.FIELDS.NAME',
    attributeName: 'name'
  },
  {
    title: 'OFFICIAL_TRIGRAMS.FIELDS.TRIGRAM',
    attributeName: 'trigram'
  },
  {
    title: 'OFFICIAL_TRIGRAMS.FIELDS.ROLE',
    attributeName: 'roles'
  },
  {
    title: 'OFFICIAL_TRIGRAMS.FIELDS.REPORTS_TO',
    attributeName: 'reportsTo'
  }
];
