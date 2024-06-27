import { BaseModel } from "src/app/base/models/base-model.model";
import { Status } from "@shared/enums/status.enum";

export interface Unit extends BaseModel {
    trigram: string;
    type: string;
    status?: Status;
}
