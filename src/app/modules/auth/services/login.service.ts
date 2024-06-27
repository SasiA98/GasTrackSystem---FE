import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AuthenticatedUser } from '@shared/models/authenticated-user.model';
import { EMPTY, Observable } from 'rxjs';
import { HttpBaseService } from 'src/app/base/services/http-base.service';
import { environment } from 'src/environments/environment';
import { AuthRequest } from '../model/auth-request.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends HttpBaseService<AuthenticatedUser> {

  constructor(injector: Injector) {
    super(injector, environment.endpoints.auth)
  }

  login(credentials: AuthRequest): Observable<AuthenticatedUser> {
    return this.httpClient.post<AuthenticatedUser>(this.baseUrl, credentials);
  }

}
