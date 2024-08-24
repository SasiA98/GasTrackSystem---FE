import { BaseModel } from "src/app/base/models/base-model.model";
import { Resource } from "./resource.model";

export interface User extends BaseModel {
    resource: Resource;
    password?: string;
    status: string;
}
