import { BaseModel } from "src/app/base/models/base-model.model";

export interface ResourceTimesheetInfo extends BaseModel {
  resourceId: number;
  unitId: number;
  unitTrigram: string;
  name: string;
  surname: string;
  remainingWorkHours: number;
}
