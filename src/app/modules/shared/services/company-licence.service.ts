import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { HttpBaseService } from 'src/app/base/services/http-base.service';
import { CompanyLicence } from '@shared/models/company-licence.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyLicenceService extends HttpBaseService<CompanyLicence> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.companyLicences);
  }
}
