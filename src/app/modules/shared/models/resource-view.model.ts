import { BaseModel } from "src/app/base/models/base-model.model";
import { Unit } from "./unit.model";

export interface ResourceView extends BaseModel {
  name: string;
  surname: string;
  seniority: number;
  age: number;
  unit: string;
  hourlyCost: number;
}
