import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { HttpBaseService } from 'src/app/base/services/http-base.service';
import { CompanyLicence } from '@shared/models/company-licence.model';
import { METHODS } from 'src/app/base/enums/methods.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyLicenceService extends HttpBaseService<CompanyLicence> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.companyLicences);
  }


  sendEmail(id: string | number | undefined) : Observable<CompanyLicence> {
    return this.request<CompanyLicence>(`${id}/send-email`, METHODS.POST);
  }

}
