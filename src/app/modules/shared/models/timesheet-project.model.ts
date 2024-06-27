import { BaseModel } from "src/app/base/models/base-model.model";
import { Allocation } from "./allocation.model";


export interface TimesheetProject extends BaseModel {
  estimatedHrCost?: number;
  actualHrCost?: number;
  allocation?: Allocation;
  name?: string;
  projectId: number;
  allocationId?: number | null;
  timesheetId: number;
  allocationHours?: number;
  hours: number;
  preImportHours: number; 
  verifiedHours?: boolean;
  cost?: number;
  commitmentPercentage?: number;
  proposedWorkHours?: string;
  note?: string;
}
