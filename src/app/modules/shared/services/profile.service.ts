import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { User } from '@shared/models/user.model';
import { EMPTY, Observable } from 'rxjs';
import { METHODS } from 'src/app/base/enums/methods.enum';
import { HttpBaseService } from 'src/app/base/services/http-base.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends HttpBaseService<User> {

  constructor(injector: Injector) { 
    super(injector, environment.endpoints.profile);
  }

  override get(): Observable<User> {
    return this.request<User>('', METHODS.GET);
  }
  
  updateProfile(model: User): Observable<User> {
    return this.request<User>('', METHODS.PATCH, model);
  }

}
