import { BaseModel } from "src/app/base/models/base-model.model";

export interface Company extends BaseModel {
    name: string;
    firstEmail: string;
    secondEmail: string;
    thirdEmail: string;
    owner: string;
    phone: string;
    regione: string;
    pronvincia: string;
    citta: string;
    address: string;
    code: string;
    note: string;
}
