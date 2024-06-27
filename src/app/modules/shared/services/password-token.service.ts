import { Injectable, Injector } from '@angular/core';
import { environment } from '@environment/environment';
import { from } from 'rxjs';
import { User } from '@shared/models/user.model';
import { EMPTY, Observable } from 'rxjs';
import { METHODS } from 'src/app/base/enums/methods.enum';
import { HttpBaseService } from 'src/app/base/services/http-base.service';
import { PasswordToken } from '@shared/models/password-token.model';

@Injectable({
  providedIn: 'root'
})
export class PasswordTokenService extends HttpBaseService<any> {
  constructor(injector: Injector) {
    super(injector, environment.endpoints.password);
  }

  forgotPassword(email: string): Observable<any> {
    return this.request<any>('reset', METHODS.POST, email);
  }

  resetPassword(token: string, password: string): Observable<any> {
    const passwordToken : PasswordToken = {
      token: token,
      password: password
    };
    return this.request<any>('save', METHODS.PUT, passwordToken);
  }

}
