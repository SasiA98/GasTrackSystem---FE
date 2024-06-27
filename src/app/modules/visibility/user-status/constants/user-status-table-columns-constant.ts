import { Column } from "@shared/components/generic-table/models/column.model";
import { Role } from "@shared/enums/role.enum";
import { Unit } from "@shared/models/unit.model";

export const UserStatusTableColumns: Column[] = [
    {
      title: 'USERS.FIELDS.ID',
      attributeName: 'id'
    },
    {
      title: 'USERS.FIELDS.NAME',
      attributeName: 'name'
    },
    {
        title: 'USERS.FIELDS.ROLES',
        attributeName: 'customRole'.replace("_"," "),
        accent: true
    },
    {
      title: 'USERS.FIELDS.UNIT',
      attributeName: 'unit',
      pipeArgs: (unit: Unit) => {
        return unit.trigram || '';
      }
    }
  ];
