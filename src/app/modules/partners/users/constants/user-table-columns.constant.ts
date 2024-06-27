import { Column } from '@shared/components/generic-table/models/column.model';
import { Role } from '@shared/enums/role.enum';


export const UserTableColumn: Column[] = [
  {
    title: 'USERS.FIELDS.NAME',
    attributeName: 'name'
  },
  {
    title: 'USERS.FIELDS.SURNAME',
    attributeName: 'surname'
  },
  {
    title: 'USERS.FIELDS.ROLES',
    attributeName: 'roles',
    accent: true,
    pipeArgs: (role: string[]) => {
      return role.join(' - ');
    }
  },
  {
    title: 'USERS.FIELDS.STATUS',
    attributeName: 'status'
  },

];
