import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';
import { METHODS } from 'src/app/base/enums/methods.enum';
import { HttpBaseService } from 'src/app/base/services/http-base.service';
import { User } from '../../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends HttpBaseService<User> {
  constructor(injector: Injector) {
    super(injector, environment.endpoints.users);
  }

  getById(id: string): Observable<User> {
    return this.request<User>("checkUserInfo/"+id, METHODS.GET)
  }

  resetPassword(id: string | number): Observable<User>{
    return this.request<User>(id+"/reset-password/", METHODS.PUT)
  }
}
