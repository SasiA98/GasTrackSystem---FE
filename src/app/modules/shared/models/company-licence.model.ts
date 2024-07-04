import { BaseModel } from "src/app/base/models/base-model.model";
import { Company } from "./company.model";

export interface CompanyLicence extends BaseModel {
  company: Company;
  licenceName: String;
  expiryDate: Date;
}
