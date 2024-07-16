import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { Company } from '@shared/models/company.model';
import { Licence } from '@shared/models/licence.model';
import { HttpBaseService } from 'src/app/base/services/http-base.service';

@Injectable({
  providedIn: 'root'
})
export class LicenceService extends HttpBaseService<Licence>{
  constructor(injector: Injector) {
    super(injector, environment.endpoints.licences);
  }
}
