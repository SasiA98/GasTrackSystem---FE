import { BaseModel } from "src/app/base/models/base-model.model";
export interface BaseUser extends BaseModel {
    roles?: string[];
}