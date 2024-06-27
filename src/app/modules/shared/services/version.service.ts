import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';
import { METHODS } from 'src/app/base/enums/methods.enum';
import { HttpBaseService } from 'src/app/base/services/http-base.service';

@Injectable({
  providedIn: 'root'
})
export class VersionService extends HttpBaseService<any> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.version);
  }

  getVersion(): Observable<any> {
    return this.httpClient.get(environment.endpoints.version, {responseType: "text"})
  }

}
