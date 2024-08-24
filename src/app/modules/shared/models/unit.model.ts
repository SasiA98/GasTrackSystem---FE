import { Status } from "@shared/enums/status.enum";
import { BaseModel } from "src/app/base/models/base-model.model";

export interface Unit extends BaseModel {
    trigram: string;
    type: string;
    status?: Status;
}
