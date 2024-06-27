import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { Skill } from '@shared/models/skill.model';
import { METHODS } from 'src/app/base/enums/methods.enum';
import { Observable } from 'rxjs';
import { HttpBaseService } from 'src/app/base/services/http-base.service';

@Injectable({
  providedIn: 'root'
})
export class SkillsService extends HttpBaseService<Skill> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.skills);
  }

  getAllSkills(): Observable<Skill[]> {
    return this.request<Skill[]>(``, METHODS.GET);
  }
  
  deleteSkillById(skillId: string | number | undefined): Observable<any> {
    return this.request<any>(`${skillId}`, METHODS.DELETE);
  }
}
