import { BaseModel } from "src/app/base/models/base-model.model";

/*
  Op = false is equal to LTE, Op = true is equal to GTE
  null represents a disabled filter.
*/

export interface ProjectFilter extends BaseModel {
  industry: null | string,
  PRESALE_id: null | number,
  DUM_id: null | number,
  bmTrigram: null | string,
  PM_id: null | number,
  status: null | string
}
