import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { METHODS } from 'src/app/base/enums/methods.enum';
import { Observable } from 'rxjs';
import { HttpBaseService } from 'src/app/base/services/http-base.service';
import { OperationManager } from '@shared/models/operation-manager.model';

@Injectable({
  providedIn: 'root'
})
export class OfficialTrigramsService extends HttpBaseService<OperationManager> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.operationManager);
  }

  getAllManagers(): Observable<OperationManager[]> {
    return this.request<OperationManager[]>(``, METHODS.GET);
  }
}
