import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { TimesheetProject } from '@shared/models/timesheet-project.model';
import { Observable } from 'rxjs';
import { METHODS } from 'src/app/base/enums/methods.enum';
import { HttpBaseService } from 'src/app/base/services/http-base.service';

@Injectable({
  providedIn: 'root'
})
export class TimesheetProjectService extends HttpBaseService<TimesheetProject>{
  constructor(injector: Injector) {
    super(injector, environment.endpoints.timesheetProject);
  }
  updateOneField(id: string | number | undefined, field: string, value: string | number): Observable<TimesheetProject> {
    return this.request<TimesheetProject>(`${id}/`, METHODS.PUT, { [field]: value });
  }
}
