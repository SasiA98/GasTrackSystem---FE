import { BaseModel } from "src/app/base/models/base-model.model";
import { Resource } from "./resource.model";

export interface ResourceSalaryDetails extends BaseModel {
  ralStartDate: Date;
  ral : number;
  ccnlLevel: string;
  ccnlLevelStartDate: Date;
  dailyAllowance: number;
  dailyAllowanceStartDate: Date;
  resource : Resource;
}

