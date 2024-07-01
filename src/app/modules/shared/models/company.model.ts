import { BaseModel } from "src/app/base/models/base-model.model";

export interface Company extends BaseModel {
    name: string;
    email: string;
    phone: string;
}
