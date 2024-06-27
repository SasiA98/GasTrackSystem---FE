import { Column } from '@shared/components/generic-table/models/column.model';
import { SkillGroup } from '@shared/models/skill-group.model';
import * as moment from 'moment';

export const SkillsTableColumns: Column[] = [
  {
    title: 'SKILLS.FIELDS.SKILL_GROUP',
    attributeName: 'skillGroup',
    pipeArgs: (skillGroup: SkillGroup) => {
      return skillGroup.name;
    }
  },
  {
    title: 'SKILLS.FIELDS.NAME',
    attributeName: 'name'
  }
];
