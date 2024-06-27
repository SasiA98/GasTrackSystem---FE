import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { Resource } from '@shared/models/resource.model';
import { Timesheet } from '@shared/models/timesheet.model';
import { Observable } from 'rxjs/internal/Observable';
import { METHODS } from 'src/app/base/enums/methods.enum';
import { HttpBaseService } from 'src/app/base/services/http-base.service';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService extends HttpBaseService<Timesheet>{
  constructor(injector: Injector) {
    super(injector, environment.endpoints.timesheet);
  }



  getResources(id: string | number | undefined ) : Observable<Resource[]> {
    return this.request<Resource[]>(`${id}/resources`, METHODS.GET);
  }
}
