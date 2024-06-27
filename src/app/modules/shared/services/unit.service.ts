import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { ApiResponse, ProjectLoadModel } from '@shared/models/projects-load.model';
import { ContentResponse, ResourceLoadModel } from '@shared/models/resource-load.model';
import { ResourceTimesheetInfo } from '@shared/models/resource-timesheet-info.model';
import { Resource } from '@shared/models/resource.model';
import { Unit } from '@shared/models/unit.model';
import { Observable } from 'rxjs/internal/Observable';
import { METHODS } from 'src/app/base/enums/methods.enum';
import { PagingAndSortingCriteria } from 'src/app/base/models/paging-and-sorting-criteria.model';
import { HttpBaseService } from 'src/app/base/services/http-base.service';

@Injectable({
  providedIn: 'root'
})
export class UnitService extends HttpBaseService<Unit>{
  constructor(injector: Injector) {
    super(injector, environment.endpoints.units);
  }

  getResourceTimesheetInfoByUnitIdAndDate(id: string | number | undefined, date: string | Date | undefined ) : Observable<ResourceTimesheetInfo[]> {
    return this.request<ResourceTimesheetInfo[]>(`${id}/timesheets/?date=${date}`, METHODS.GET);
  }

  getActiveResources(id: string | number | undefined ) : Observable<Resource[]> {
    return this.request<Resource[]>(`${id}/active-resources`, METHODS.GET);
  }

  getActiveResourcesInLastSixMonths(id: string | number | undefined ) : Observable<Resource[]> {
    return this.request<Resource[]>(`${id}/active-resources-in-last-six-months`, METHODS.GET);
  }

  getAllResources(date: string | Date | undefined) : Observable<ResourceTimesheetInfo[]> {
    return this.request<ResourceTimesheetInfo[]>(`timesheets/?date=${date}`, METHODS.GET);
  }

  getResourceLoad(id: string | number, year: string | number, preAllocation: boolean, pageable?: PagingAndSortingCriteria) : Observable<ContentResponse> {
    const unitId = id ? `&unit-id=${id}` : "";
    const pageParam = pageable?.page !== undefined ? `&page=${pageable.page}` : "";
    const sizeParam = pageable?.size !== undefined ? `&size=${pageable.size}` : "";
    const param = pageParam + sizeParam;
    return this.request<ContentResponse>(`resources-load?year=${year}&pre-allocation=${preAllocation}` + unitId + param, METHODS.GET);
  }

  getProjectLoad(id: string | number | undefined, year: string | number, status: string[] | undefined, pageable?: PagingAndSortingCriteria) : Observable<ApiResponse> {
    const unitId = id ? `&unit-id=${id}` : "";
    const statusParam = status ? `&status=${status}` : "";
    const pageParam = pageable?.page !== undefined ? `&page=${pageable.page}` : "";
    const sizeParam = pageable?.size !== undefined ? `&size=${pageable.size}` : "";
    const param = pageParam + sizeParam;

    return this.request<ApiResponse>(`projects-gantt?year=${year}`+ unitId + statusParam + param, METHODS.GET);
  }


}
