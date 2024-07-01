import { BaseModel } from "src/app/base/models/base-model.model";

export interface Licence extends BaseModel {
    licenceId: string;
    name: string;
}
