import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { Project } from '@shared/models/project.model';
import { Resource } from '@shared/models/resource.model';
import { Allocation } from '@shared/models/allocation.model';
import { HttpBaseService } from 'src/app/base/services/http-base.service';
import { METHODS } from 'src/app/base/enums/methods.enum';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends HttpBaseService<Project>{
  constructor(injector: Injector) {
    super(injector, environment.endpoints.projects);
  }

  getResources(id: string | number | undefined ) : Observable<Resource[]> {
      return this.request<Resource[]>(`${id}/resources`, METHODS.GET);
  }

  getAllocationsById(id: string | number | undefined ) : Observable<Allocation[]> {
        return this.request<Allocation[]>(`${id}/allocations`, METHODS.GET);
    }

}
