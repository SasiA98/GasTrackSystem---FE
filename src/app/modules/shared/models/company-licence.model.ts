import { BaseModel } from "src/app/base/models/base-model.model";

export interface CompanyLicence extends BaseModel {
  companyId: number;
  licenceId: number;
  companyName: String;
  licenceName: String;
  startDate: Date;
  endDate: Date;
}
