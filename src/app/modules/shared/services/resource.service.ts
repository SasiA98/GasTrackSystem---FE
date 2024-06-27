import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { ResourceHourlyCost } from '@shared/models/resource-hourly-cost.model';
import { Resource } from '@shared/models/resource.model';
import { Allocation } from '@shared/models/allocation.model';
import { Observable } from 'rxjs';
import { METHODS } from 'src/app/base/enums/methods.enum';
import { HttpBaseService } from 'src/app/base/services/http-base.service';
import { Timesheet } from '@shared/models/timesheet.model';
import { ResourceSalaryDetails } from '@shared/models/resource-salary-details.model';
import { Skill } from '@shared/models/skill.model';
import { ResourceSkillModel } from '@shared/models/resource-skill.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService extends HttpBaseService<Resource>{

  constructor(injector: Injector) {
    super(injector, environment.endpoints.resources);
  }

  getAllHourlyCostsById(resourceId: string | number | undefined ): Observable<ResourceHourlyCost[]> {
    return this.request<ResourceHourlyCost[]>(`${resourceId}/hourlycosts`, METHODS.GET);
  }

  getAllocationsById(resourceId: string | number | undefined ): Observable<Allocation[]> {
    return this.request<Allocation[]>(`${resourceId}/allocations`, METHODS.GET);
  }

  getLastSixTimesheetById(resourceId: string | number | undefined ): Observable<Timesheet[]> {
    return this.request<Timesheet[]>(`${resourceId}/last-six-timesheets`, METHODS.GET);
  }

  getTimesheetByDateAndId(resourceId: string | number | undefined, date: string): Observable<Timesheet> {
    return this.request<Timesheet>(`${resourceId}/timesheet?date=${date}`, METHODS.GET);
  }

  getSalaryDetailsById(resourceId: string | number | undefined): Observable<ResourceSalaryDetails[]> {
    return this.request<ResourceSalaryDetails[]>(`${resourceId}/salaryDetails`, METHODS.GET);
  }

  addOrUpdateSkill(resourceId: string | number | undefined, skillId: string | number | undefined, skill_submit: ResourceSkillModel): Observable<any> {
    return this.request<any>(`${resourceId}/skills/${skillId}`, METHODS.POST, skill_submit);
  }

  deleteSkillByResourceId(resourceId: string | number | undefined, skillId: string | number | undefined): Observable<any> {
    return this.request<any>(`${resourceId}/skills/${skillId}`, METHODS.DELETE);
  }

  getSkillsByResourceId(resourceId: string | number | undefined ): Observable<Skill[]> {
    return this.request<Skill[]>(`${resourceId}/skills`, METHODS.GET);
  }
}
