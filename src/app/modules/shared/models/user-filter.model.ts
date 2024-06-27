import { BaseModel } from "src/app/base/models/base-model.model";
import { ExtendedUnitType } from "@shared/enums/extended-type.enum";
import { ExtendedStatus } from '@shared/enums/extended-status.enum';
import { Role } from "@shared/enums/role.enum";
/*
  Op = false is equal to LTE, Op = true is equal to GTE
  null represents a disabled filter.
*/

export interface UserFilter extends BaseModel {
  roles: Role[];
  status: ExtendedStatus
}
