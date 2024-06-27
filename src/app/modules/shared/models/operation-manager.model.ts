import { BaseModel } from "src/app/base/models/base-model.model";
import { Industry } from '@shared/enums/industry.enum';

export interface OperationManager extends BaseModel {
    legalEntity?: string;
    industry?: Industry;
    name?: string;
    trigram?: string;
    roles?: string;
    reportsTo?: string;
}
