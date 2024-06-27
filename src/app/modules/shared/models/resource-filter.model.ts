import { BaseModel } from "src/app/base/models/base-model.model";
import { ExtendedUnitType } from "@shared/enums/extended-type.enum";
import { CurrentResourceStatus } from '@shared/enums/current-resource-status.enum';

/*
  Op = false is equal to LTE, Op = true is equal to GTE
  null represents a disabled filter.
*/

export interface prova2 {
  skill?: number | string, 
  rating?: number | string 
}

export interface ResourceFilter extends BaseModel {
  age: null | number,
  ageOp: boolean,
  seniority: null | number,
  seniorityOp: boolean,
  unitType: ExtendedUnitType,
  unit: null | number,
  hourlyCost: null | number,
  hourlyCostOp: boolean,
  resourceStatus: CurrentResourceStatus,
  skill?: null | number,
  rating?: null | number,
  skillsArray?: prova2[],
}
