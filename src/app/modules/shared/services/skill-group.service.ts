import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { SkillGroup } from '@shared/models/skill-group.model';
import { Observable } from 'rxjs';
import { METHODS } from 'src/app/base/enums/methods.enum';
import { HttpBaseService } from 'src/app/base/services/http-base.service';

@Injectable({
  providedIn: 'root'
})
export class SkillGroupsService extends HttpBaseService<SkillGroup> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.skillgroups);
  }
  
  getAllSkillGroups(): Observable<SkillGroup[]> {
    return this.request<SkillGroup[]>(``, METHODS.GET);
  }

}
