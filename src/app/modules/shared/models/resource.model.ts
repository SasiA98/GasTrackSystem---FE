import { BaseModel } from "src/app/base/models/base-model.model";

import { Role } from "@shared/enums/role.enum";
import { Unit } from "./unit.model";

export interface Resource extends BaseModel {
  id: number;
  employee_id: number;
  name: string;
  surname: string;
  email: string;
  birthDate: string | Date;
  hiringDate: Date;
  dischargeUnitDate: string | Date;
  unit?: Unit;
  site?: string;
  location?: string;
  lastHourlyCost : number;
  currentHourlyCost : number;
  lastWorkingTime: number;
  lastWorkingTimeStartDate?: string | Date;
  lastHourlyCostStartDate?: string | Date;
  ral?: number;
  ralStartDate?: string | Date;
  dailyAllowance?: number;
  dailyAllowanceStartDate?: string | Date;
  ccnlLevel?: string;
  ccnlLevelStartDate?: string | Date;
  roles: Role[];
  leaveDate?: Date;
  trigram: string;
  estimatedCost?: number;
  note?: string;
}
