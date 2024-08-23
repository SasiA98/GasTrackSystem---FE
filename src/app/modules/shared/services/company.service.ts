import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { CompanyLicence } from '@shared/models/company-licence.model';
import { Company } from '@shared/models/company.model';
import { Observable } from 'rxjs';
import { HttpBaseService } from 'src/app/base/services/http-base.service';
import { METHODS } from 'src/app/base/enums/methods.enum';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends HttpBaseService<Company>{
  constructor(injector: Injector) {
    super(injector, environment.endpoints.companies);
  }

  getCompanyLicenceById(companyId: string | number | undefined ): Observable<CompanyLicence[]> {
    return this.request<CompanyLicence[]>(`${companyId}/company-licences`, METHODS.GET);
  }
}
