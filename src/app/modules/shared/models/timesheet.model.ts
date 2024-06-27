import { BaseModel } from "src/app/base/models/base-model.model";
import { TimesheetProject } from './timesheet-project.model';

export interface Timesheet extends BaseModel {
  resourceId: number;
  startDate: Date;
  totWorkHours: number;
  remainingWorkHours: number;
  relatedProjects: TimesheetProject[];
  note?: string;
}
