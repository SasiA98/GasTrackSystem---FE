import { BaseModel } from "src/app/base/models/base-model.model";

export interface Licence extends BaseModel {
    note: string;
    name: string;
}
