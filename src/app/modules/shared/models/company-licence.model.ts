import { BaseModel } from "src/app/base/models/base-model.model";
import { Company } from "./company.model";
import { Licence } from "./licence.model";

export interface CompanyLicence extends BaseModel {
  company: Company;
  licence: Licence;
  emailSent: number;
  expiryDate: Date;
}
