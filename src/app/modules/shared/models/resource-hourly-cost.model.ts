import { BaseModel } from "src/app/base/models/base-model.model";
import { Resource } from "./resource.model";

export interface ResourceHourlyCost extends BaseModel {
  startDate: Date;
  cost : number;
  resource : Resource;
}

