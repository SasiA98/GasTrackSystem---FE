import { BaseModel } from "src/app/base/models/base-model.model";
import { Role } from '@shared/enums/role.enum';

export interface Allocation extends BaseModel {
  projectId: number;
  resourceId: number;
  role: Role;
  startDate: Date;
  endDate: Date;
  realCommitment: boolean;
  commitmentPercentage: number | null;
  hours: number | null;
  commitment: number | null;
}
